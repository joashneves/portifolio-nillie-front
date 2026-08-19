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
  const [editingCat, setEditingCat] = useState(null)

  const [imgNome, setImgNome] = useState('')
  const [imgDescricao, setImgDescricao] = useState('')
  const [imgImagem, setImgImagem] = useState(null)
  const [editingImg, setEditingImg] = useState(null)

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
    setError('')
    try {
      if (editingCat) {
        await api.updateCategoria(editingCat.id, catNome, catImagem)
      } else {
        await api.createCategoria(catNome, catImagem)
      }
      setCatNome('')
      setCatImagem(null)
      setEditingCat(null)
      loadCategorias()
      if (selectedCat) loadCategoria(selectedCat.id)
    } catch (err) {
      setError(err.message)
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
    setCatImagem(null)
  }

  const handleImagenSubmit = async (e) => {
    e.preventDefault()
    if (!selectedCat) return
    setError('')
    try {
      const data = { nome: imgNome, descricao: imgDescricao }
      if (editingImg) {
        await api.updateImagen(selectedCat.id, editingImg.id, data, imgImagem)
      } else {
        await api.createImagen(selectedCat.id, data, imgImagem)
      }
      setImgNome('')
      setImgDescricao('')
      setImgImagem(null)
      setEditingImg(null)
      loadCategoria(selectedCat.id)
    } catch (err) {
      setError(err.message)
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
    setImgImagem(null)
  }

  if (loading) return <p className={styles.loading}>Carregando...</p>

  return (
    <div>
      <h2>Dashboard</h2>
      <p className={styles.welcome}>Ola, {user?.username}!</p>
      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <h3>Categorias</h3>
          <ul className={styles.catList}>
            {categorias.map((cat) => (
              <li
                key={cat.id}
                className={selectedCat?.id === cat.id ? styles.active : ''}
              >
                <button onClick={() => loadCategoria(cat.id)}>{cat.nome}</button>
                <div className={styles.catActions}>
                  <button
                    className={styles.sm}
                    onClick={() => startEditCategoria(cat)}
                  >
                    Editar
                  </button>
                  <button
                    className={`${styles.sm} ${styles.danger}`}
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
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setCatImagem(e.target.files[0])}
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
                    setCatImagem(null)
                  }}
                >
                  Cancelar
                </button>
              )}
            </div>
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
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImgImagem(e.target.files[0])}
                />
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
                        setImgImagem(null)
                      }}
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </form>

              {selectedCat.imagens?.length > 0 ? (
                <div className={styles.imagesGrid}>
                  {selectedCat.imagens.map((img) => (
                    <div key={img.id} className={styles.imageCard}>
                      {img.imagem_url && (
                        <img src={img.imagem_url} alt={img.nome} />
                      )}
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
    </div>
  )
}
