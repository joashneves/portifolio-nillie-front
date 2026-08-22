import { useState, useEffect } from 'react'
import { api } from '../../services/api'
import { useAuth } from '../../contexts/useAuth'
import styles from './Painel.module.css'

export default function Painel() {
  const { user } = useAuth()
  const [categorias, setCategorias] = useState([])
  const [selectedCat, setSelectedCat] = useState(null)
  const [catNome, setCatNome] = useState('')
  const [catImagem, setCatImagem] = useState(null)
  const [catPreview, setCatPreview] = useState(null)
  const [catOrdem, setCatOrdem] = useState('')
  const [editingCat, setEditingCat] = useState(null)

  const [imgNome, setImgNome] = useState('')
  const [imgDescricao, setImgDescricao] = useState('')
  const [imgImagem, setImgImagem] = useState(null)
  const [imgPreview, setImgPreview] = useState(null)
  const [editingImg, setEditingImg] = useState(null)

  const [uploading, setUploading] = useState(false)
  const [uploadingCat, setUploadingCat] = useState(false)
  const [toast, setToast] = useState(null)

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const loadCategorias = () => {
    api
      .getCategorias()
      .then(setCategorias)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadCategorias()
  }, [])

  const loadCategoria = async (id) => {
    const data = await api.getCategoria(id)
    setSelectedCat(data)
  }

  const handleCategoriaSubmit = async (e) => {
    e.preventDefault()
    if (uploadingCat) return
    setError('')
    setUploadingCat(true)
    try {
      if (editingCat) {
        await api.updateCategoria(editingCat.id, catNome, catImagem, catOrdem)
        showToast('success', 'Categoria atualizada com sucesso!')
      } else {
        await api.createCategoria(catNome, catImagem, catOrdem)
        showToast('success', 'Categoria criada com sucesso!')
      }
      setCatNome('')
      clearCatFile()
      setCatOrdem('')
      setEditingCat(null)
      loadCategorias()
      if (selectedCat) loadCategoria(selectedCat.id)
    } catch (err) {
      showToast('error', err.message || 'Erro ao salvar categoria.')
    } finally {
      setUploadingCat(false)
    }
  }

  const handleDeleteCategoria = async (id) => {
    if (!confirm('Deletar esta categoria?')) return
    try {
      await api.deleteCategoria(id)
      if (selectedCat?.id === id) setSelectedCat(null)
      loadCategorias()
    } catch (err) {
      setError(err.message)
    }
  }

  const startEditCategoria = (cat) => {
    setEditingCat(cat)
    setCatNome(cat.nome)
    setCatOrdem(String(cat.ordem ?? ''))
    clearCatFile()
  }

  const categoriasOrdenadas = [...categorias].sort(
    (a, b) =>
      (a.ordem ?? 0) - (b.ordem ?? 0) || a.nome.localeCompare(b.nome)
  )

  const showToast = (type, message) => setToast({ type, message })

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 3500)
    return () => clearTimeout(t)
  }, [toast])

  const clearImgFile = () => {
    setImgImagem(null)
    if (imgPreview) {
      URL.revokeObjectURL(imgPreview)
      setImgPreview(null)
    }
  }

  const clearCatFile = () => {
    setCatImagem(null)
    if (catPreview) {
      URL.revokeObjectURL(catPreview)
      setCatPreview(null)
    }
  }

  const handleCatSelect = (e) => {
    const file = e.target.files[0]
    setCatImagem(file)
    if (catPreview) URL.revokeObjectURL(catPreview)
    setCatPreview(file ? URL.createObjectURL(file) : null)
  }

  const handleImgSelect = (e) => {
    const file = e.target.files[0]
    setImgImagem(file)
    if (imgPreview) URL.revokeObjectURL(imgPreview)
    setImgPreview(file ? URL.createObjectURL(file) : null)
  }

  const handleImagenSubmit = async (e) => {
    e.preventDefault()
    if (!selectedCat || uploading) return
    setError('')
    setUploading(true)
    try {
      const data = { nome: imgNome, descricao: imgDescricao }
      if (editingImg) {
        await api.updateImagen(selectedCat.id, editingImg.id, data, imgImagem)
        showToast('success', 'Imagem atualizada com sucesso!')
      } else {
        await api.createImagen(selectedCat.id, data, imgImagem)
        showToast('success', 'Imagem enviada com sucesso!')
      }
      setImgNome('')
      setImgDescricao('')
      clearImgFile()
      setEditingImg(null)
      loadCategoria(selectedCat.id)
    } catch (err) {
      showToast('error', err.message || 'Erro ao enviar imagem.')
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteImagen = async (imagenId) => {
    if (!selectedCat) return
    if (!confirm('Deletar esta imagem?')) return
    try {
      await api.deleteImagen(selectedCat.id, imagenId)
      loadCategoria(selectedCat.id)
    } catch (err) {
      setError(err.message)
    }
  }

  const startEditImagen = (img) => {
    setEditingImg(img)
    setImgNome(img.nome)
    setImgDescricao(img.descricao || '')
    clearImgFile()
  }

  if (loading) return <p className={styles.loading}>Carregando...</p>

  return (
    <div className={styles.page}>
      <h2>Dashboard</h2>
      <p className={styles.welcome}>Ola, {user?.username}!</p>
      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <h3>Categorias</h3>
          <ul className={styles.catList}>
            {categoriasOrdenadas.map((cat) => (
              <li
                key={cat.id}
                className={selectedCat?.id === cat.id ? styles.active : ''}
              >
                <button onClick={() => loadCategoria(cat.id)}>
                  {String(cat.ordem ?? '').padStart(2, '0')} · {cat.nome}
                </button>
                <div className={styles.catActions}>
                  <button
                    className={styles.sm}
                    onClick={() => startEditCategoria(cat)}
                  >
                    Editar
                  </button>
                  <button
                    className={styles.danger}
                    onClick={() => handleDeleteCategoria(cat.id)}
                  >
                    X
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <form onSubmit={handleCategoriaSubmit} className={styles.form}>
            <h4>{editingCat ? 'Editar' : 'Nova'} Categoria</h4>
            <input
              type="text"
              placeholder="Nome"
              value={catNome}
              onChange={(e) => setCatNome(e.target.value)}
              required
            />
            <label className={styles.uploadZone}>
              <input
                type="file"
                accept="image/*"
                className={styles.fileInput}
                onChange={handleCatSelect}
              />
              {catPreview ? (
                <img src={catPreview} alt="Previa da categoria" />
              ) : (
                <>
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" />
                    <path d="M12 11v6m-3-3h6" strokeLinecap="round" />
                  </svg>
                  <span>
                    {editingCat ? 'Trocar imagem' : 'Escolher imagem'}
                  </span>
                </>
              )}
            </label>
            <input
              type="number"
              min="0"
              placeholder="Ordem de exibicao (ex: 1 = primeiro)"
              value={catOrdem}
              onChange={(e) => setCatOrdem(e.target.value)}
              className={styles.ordemInput}
            />
            <div className={styles.formActions}>
              <button type="submit">
                {editingCat ? 'Salvar' : 'Criar'}
              </button>
              {editingCat && (
                <button
                  type="button"
                  className={styles.secondary}
                  onClick={() => {
                    setEditingCat(null)
                    setCatNome('')
                    setCatOrdem('')
                    clearCatFile()
                  }}
                >
                  Cancelar
                </button>
              )}
            </div>
            {uploadingCat && (
              <div className={styles.sendingOverlay}>
                <span className={styles.spinner} />
                <p>Salvando categoria...</p>
              </div>
            )}
          </form>
        </aside>

        <main className={styles.main}>
          {selectedCat ? (
            <>
              <h3>Imagens de: {selectedCat.nome}</h3>

              <form onSubmit={handleImagenSubmit} className={styles.form}>
                <h4>{editingImg ? 'Editar' : 'Nova'} Imagem</h4>
                <input
                  type="text"
                  placeholder="Nome"
                  value={imgNome}
                  onChange={(e) => setImgNome(e.target.value)}
                  required
                />
                <textarea
                  placeholder="Descricao"
                  value={imgDescricao}
                  onChange={(e) => setImgDescricao(e.target.value)}
                />
                <label className={styles.uploadZone}>
                  <input
                    type="file"
                    accept="image/*"
                    className={styles.fileInput}
                    onChange={handleImgSelect}
                  />
                  {imgPreview ? (
                    <img src={imgPreview} alt="Previa da imagem" />
                  ) : (
                    <>
                      <svg
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" />
                        <path
                          d="M12 11v6m-3-3h6"
                          strokeLinecap="round"
                        />
                      </svg>
                      <span>
                        {editingImg ? 'Trocar imagem' : 'Escolher imagem'}
                      </span>
                    </>
                  )}
                </label>
                <div className={styles.formActions}>
                  <button type="submit">
                    {editingImg ? 'Salvar' : 'Criar'}
                  </button>
                  {editingImg && (
                    <button
                      type="button"
                      className={styles.secondary}
                      onClick={() => {
                        setEditingImg(null)
                        setImgNome('')
                        setImgDescricao('')
                        clearImgFile()
                      }}
                    >
                      Cancelar
                    </button>
                  )}
                </div>
                {uploading && (
                  <div className={styles.sendingOverlay}>
                    <span className={styles.spinner} />
                    <p>Enviando imagem...</p>
                  </div>
                )}
              </form>

              {selectedCat.imagens?.length > 0 ? (
                <div className={styles.imagesGrid}>
                  {selectedCat.imagens.map((img) => (
                    <div key={img.id} className={styles.imageCard}>
                      <img
                        src={img.imagem_url || '/placeholder.svg'}
                        alt={img.nome}
                      />
                      <h4>{img.nome}</h4>
                      {img.descricao && <p>{img.descricao}</p>}
                      <div className={styles.cardActions}>
                        <button
                          className={styles.sm}
                          onClick={() => startEditImagen(img)}
                        >
                          Editar
                        </button>
                        <button
                          className={`${styles.sm} ${styles.danger}`}
                          onClick={() => handleDeleteImagen(img.id)}
                        >
                          Excluir
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>Nenhuma imagem ainda.</p>
              )}
            </>
          ) : (
            <p className={styles.noSelection}>
              Selecione uma categoria ao lado para gerenciar imagens.
            </p>
          )}
        </main>
      </div>

      {toast && (
        <div className={styles.overlay} onClick={() => setToast(null)}>
          <div
            className={`${styles.popup} ${
              toast.type === 'success' ? styles.success : styles.fail
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <span className={styles.popupIcon}>
              {toast.type === 'success' ? '✓' : '!'}
            </span>
            <p>{toast.message}</p>
            <button onClick={() => setToast(null)}>OK</button>
          </div>
        </div>
      )}
    </div>
  )
}
