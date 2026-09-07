import { useState } from 'react'
import { api } from '../../../services/api'
import CategoryCard from '../../../components/CategoryCard/CategoryCard'
import ImageCard from '../../../components/ImageCard/ImageCard'
import styles from '../cores/Categorias.module.css'

export default function CategoriaTab({ categorias, loadCategorias, setError, showToast }) {
  const [view, setView] = useState('manage')
  const [selectedId, setSelectedId] = useState(null)
  const [selectedCat, setSelectedCat] = useState(null)
  const [catNome, setCatNome] = useState('')
  const [catImagem, setCatImagem] = useState(null)
  const [catPreview, setCatPreview] = useState(null)
  const [catOrdem, setCatOrdem] = useState('')
  const [editingCat, setEditingCat] = useState(null)
  const [uploadingCat, setUploadingCat] = useState(false)
  const [dropActive, setDropActive] = useState(false)

  const [imgNome, setImgNome] = useState('')
  const [imgDescricao, setImgDescricao] = useState('')
  const [imgImagem, setImgImagem] = useState(null)
  const [imgPreview, setImgPreview] = useState(null)
  const [editingImg, setEditingImg] = useState(null)
  const [uploading, setUploading] = useState(false)

  const categoriasOrdenadas = [...categorias].sort(
    (a, b) => (a.ordem ?? 0) - (b.ordem ?? 0) || a.nome.localeCompare(b.nome)
  )
  const imagens = selectedCat?.imagens || []

  const isObjectURL = (url) => typeof url === 'string' && url.startsWith('blob:')

  const clearCatFile = () => {
    setCatImagem(null)
    if (isObjectURL(catPreview)) URL.revokeObjectURL(catPreview)
    setCatPreview(editingCat?.imagem_url || null)
  }

  const clearImgFile = () => {
    setImgImagem(null)
    if (isObjectURL(imgPreview)) URL.revokeObjectURL(imgPreview)
    setImgPreview(editingImg?.imagem_url || null)
  }

  const handleCatFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return
    if (isObjectURL(catPreview)) URL.revokeObjectURL(catPreview)
    setCatImagem(file)
    setCatPreview(URL.createObjectURL(file))
  }

  const handleImgFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return
    if (isObjectURL(imgPreview)) URL.revokeObjectURL(imgPreview)
    setImgImagem(file)
    setImgPreview(URL.createObjectURL(file))
  }

  const handleCatSubmit = async (e) => {
    e.preventDefault()
    if (uploadingCat) return
    setError(''); setUploadingCat(true)
    try {
      if (editingCat) {
        await api.updateCategoria(editingCat.id, catNome, catImagem, catOrdem)
        showToast('success', 'Categoria atualizada!')
      } else {
        await api.createCategoria(catNome, catImagem, catOrdem)
        showToast('success', 'Categoria criada!')
      }
      setCatNome(''); clearCatFile(); setCatOrdem(''); setEditingCat(null)
      loadCategorias()
    } catch (err) {
      showToast('error', err.message || 'Erro ao salvar categoria.')
    } finally { setUploadingCat(false) }
  }

  const handleDeleteCat = async (id) => {
    if (!confirm('Deletar esta categoria e todas as suas imagens?')) return
    try {
      await api.deleteCategoria(id)
      if (selectedId === id) { setSelectedId(null); setSelectedCat(null) }
      loadCategorias()
      showToast('success', 'Categoria deletada!')
    } catch (err) { setError(err.message) }
  }

  const startEditCat = (cat) => {
    setEditingCat(cat)
    setCatNome(cat.nome)
    setCatOrdem(String(cat.ordem ?? ''))
    setCatImagem(null)
    if (isObjectURL(catPreview)) URL.revokeObjectURL(catPreview)
    setCatPreview(cat.imagem_url || null)
  }

  const cancelEdit = () => {
    setEditingCat(null)
    setCatNome(''); setCatOrdem(''); clearCatFile()
  }

  const loadCategoria = async (id) => {
    setSelectedId(id)
    resetImgForm()
    try {
      const data = await api.getCategoria(id)
      setSelectedCat(data)
    } catch (err) { setError(err.message) }
  }

  const refreshCategoria = async () => {
    if (!selectedId) return
    try {
      const data = await api.getCategoria(selectedId)
      setSelectedCat(data)
    } catch (err) { setError(err.message) }
  }

    const resetImgForm = () => {
    setImgNome(''); setImgDescricao(''); setEditingImg(null)
    setImgImagem(null)
    if (isObjectURL(imgPreview)) URL.revokeObjectURL(imgPreview)
    setImgPreview(null)
  }

  const handleImgSubmit = async (e) => {
    e.preventDefault()
    if (!selectedId || uploading) return
    setError(''); setUploading(true)
    try {
      const data = { nome: imgNome, descricao: imgDescricao }
      if (editingImg) {
        await api.updateImagen(selectedId, editingImg.id, data, imgImagem)
        showToast('success', 'Imagem atualizada!')
      } else {
        await api.createImagen(selectedId, data, imgImagem)
        showToast('success', 'Imagem enviada!')
      }
      resetImgForm()
      await refreshCategoria()
    } catch (err) {
      showToast('error', err.message || 'Erro ao enviar imagem.')
    } finally { setUploading(false) }
  }

  const handleDeleteImg = async (imgId) => {
    if (!confirm('Deletar esta imagem?')) return
    try { await api.deleteImagen(selectedId, imgId); await refreshCategoria() }
    catch (err) { setError(err.message) }
  }

  const startEditImg = (img) => {
    setEditingImg(img); setImgNome(img.nome); setImgDescricao(img.descricao || ''); clearImgFile()
  }

  const moveCategoria = async (idx, dir) => {
    const target = idx + dir
    if (target < 0 || target >= categoriasOrdenadas.length) return
    const a = categoriasOrdenadas[idx], b = categoriasOrdenadas[target]
    try {
      await api.updateCategoria(a.id, a.nome, null, b.ordem ?? 0)
      await api.updateCategoria(b.id, b.nome, null, a.ordem ?? 0)
      loadCategorias()
    } catch (err) { setError(err.message) }
  }

  return (
    <>
      <div className={styles.viewToggle}>
        <button className={view === 'manage' ? styles.active : ''} onClick={() => setView('manage')}>Gerenciar</button>
        <button className={view === 'preview' ? styles.active : ''} onClick={() => setView('preview')}>Prévia da Home</button>
      </div>

      {view === 'manage' ? (
        <>
          <div className={styles.manager}>
            <aside className={styles.formPanel}>
              <h3>{editingCat ? 'Editar' : 'Nova'} Categoria</h3>
              <form onSubmit={handleCatSubmit} className={styles.form}>
                <div className={styles.field}>
                  <label htmlFor="catNome">Nome</label>
                  <input id="catNome" type="text" placeholder="Nome da categoria" value={catNome} onChange={(e) => setCatNome(e.target.value)} required />
                </div>

                <div
                  className={`${styles.dropZone} ${dropActive ? styles.dropActive : ''}`}
                  onClick={() => document.getElementById('catFile').click()}
                  onDragOver={(e) => { e.preventDefault(); setDropActive(true) }}
                  onDragLeave={() => setDropActive(false)}
                  onDrop={(e) => { e.preventDefault(); setDropActive(false); handleCatFile(e.dataTransfer.files[0]) }}
                >
                  <input id="catFile" type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleCatFile(e.target.files[0])} />
                  {catPreview ? (
                    <>
                      <img src={catPreview} alt="Prévia" />
                      {editingCat && !catImagem && <span className={styles.keepOriginal}>Imagem atual mantida</span>}
                    </>
                  ) : (
                    <div className={styles.dropHint}>
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" /><path d="M12 11v6m-3-3h6" strokeLinecap="round" /></svg>
                      <span>Arraste a imagem aqui ou clique</span>
                    </div>
                  )}
                </div>

                <div className={styles.field}>
                  <label htmlFor="catOrdem">Ordem</label>
                  <input id="catOrdem" type="number" min="0" placeholder="0" value={catOrdem} onChange={(e) => setCatOrdem(e.target.value)} />
                </div>

                <div className={styles.formActions}>
                  <button type="submit" className={styles.submit} disabled={uploadingCat}>{uploadingCat ? 'Salvando...' : editingCat ? 'Salvar' : 'Criar'}</button>
                  {editingCat && <button type="button" className={styles.cancel} onClick={cancelEdit}>Cancelar</button>}
                </div>
              </form>
            </aside>

            <section>
              {categoriasOrdenadas.length > 0 ? (
                <div className={styles.grid}>
                  {categoriasOrdenadas.map((cat, i) => (
                    <div key={cat.id} className={`${styles.card} ${selectedId === cat.id ? styles.cardSelected : ''}`} onClick={() => loadCategoria(cat.id)}>
                      <img className={styles.thumb} src={cat.imagem_url || '/placeholder.svg'} alt={cat.nome} />
                      <span className={styles.ordemBadge}>{String(cat.ordem ?? '').padStart(2, '0')}</span>
                      <div className={styles.info}>
                        <h4>{cat.nome}</h4>
                        <div className={styles.actions} onClick={(e) => e.stopPropagation()}>
                          <button className={styles.actionBtn} disabled={i === 0} onClick={() => moveCategoria(i, -1)}>↑</button>
                          <button className={styles.actionBtn} disabled={i === categoriasOrdenadas.length - 1} onClick={() => moveCategoria(i, 1)}>↓</button>
                          <button className={styles.actionBtn} onClick={() => startEditCat(cat)}>Editar</button>
                          <button className={`${styles.actionBtn} ${styles.danger}`} onClick={() => handleDeleteCat(cat.id)}>Excluir</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : <p className={styles.empty}>Nenhuma categoria ainda.</p>}
            </section>
          </div>

          {selectedCat && (
            <section className={styles.imagesSection}>
              <div className={styles.imagesHeader}>
                <h3>Imagens de: {selectedCat.nome}</h3>
              </div>

              <div className={styles.imagesLayout}>
                <form onSubmit={handleImgSubmit} className={styles.form}>
                  <h4>{editingImg ? 'Editar' : 'Nova'} Imagem</h4>
                  <div className={styles.field}>
                    <label htmlFor="imgNome">Nome</label>
                    <input id="imgNome" type="text" placeholder="Nome da imagem" value={imgNome} onChange={(e) => setImgNome(e.target.value)} required />
                  </div>
                  <div className={styles.field}>
                    <label htmlFor="imgDescricao">Descrição</label>
                    <textarea id="imgDescricao" placeholder="Descrição" value={imgDescricao} onChange={(e) => setImgDescricao(e.target.value)} />
                  </div>
                  <div
                    className={styles.dropZone}
                    onClick={() => document.getElementById('imgFile').click()}
                    onDragOver={(e) => { e.preventDefault(); setDropActive(true) }}
                    onDragLeave={() => setDropActive(false)}
                    onDrop={(e) => { e.preventDefault(); setDropActive(false); handleImgFile(e.dataTransfer.files[0]) }}
                  >
                    <input id="imgFile" type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleImgFile(e.target.files[0])} />
                    {imgPreview ? <img src={imgPreview} alt="Prévia" /> : (
                      <div className={styles.dropHint}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" /><path d="M12 11v6m-3-3h6" strokeLinecap="round" /></svg>
                        <span>Arraste ou clique para escolher</span>
                      </div>
                    )}
                  </div>
                  <div className={styles.formActions}>
                    <button type="submit" className={styles.submit} disabled={uploading}>{uploading ? 'Enviando...' : editingImg ? 'Salvar' : 'Adicionar'}</button>
                    {editingImg && <button type="button" className={styles.cancel} onClick={resetImgForm}>Cancelar</button>}
                  </div>
                </form>

                <div className={styles.imagesGrid}>
                  {imagens.length > 0 ? imagens.map((img) => (
                    <div key={img.id} className={styles.imageCard}>
                      <ImageCard imagem={img} />
                      <h4>{img.nome}</h4>
                      {img.descricao && <p>{img.descricao}</p>}
                      <div className={styles.actions}>
                        <button className={styles.actionBtn} onClick={() => startEditImg(img)}>Editar</button>
                        <button className={`${styles.actionBtn} ${styles.danger}`} onClick={() => handleDeleteImg(img.id)}>Excluir</button>
                      </div>
                    </div>
                  )) : <p className={styles.empty}>Nenhuma imagem nesta categoria.</p>}
                </div>
              </div>
            </section>
          )}
        </>
      ) : (
        <section className={styles.previewSection}>
          <div className={styles.previewHeader}>
            <h3>Prévia da categoria</h3>
            <span className={styles.previewHint}>Toque em uma categoria para pré-visualizar</span>
          </div>
          {categoriasOrdenadas.length > 0 ? (
            <>
              <div className={styles.previewCats}>
                {categoriasOrdenadas.map((cat) => (
                  <button
                    key={cat.id}
                    className={`${styles.previewCatBtn} ${selectedId === cat.id ? styles.previewCatActive : ''}`}
                    onClick={() => loadCategoria(cat.id)}
                  >
                    {cat.nome}
                  </button>
                ))}
              </div>
              {selectedCat ? (
                <div className={styles.previewCatPage}>
                  <div className={styles.previewCatHeader} style={{ '--bg-img': `url(${selectedCat.imagem_url})` }}>
                    <h1>{selectedCat.nome}</h1>
                  </div>
                  {(selectedCat.imagens || []).length > 0 ? (
                    <div className={styles.previewGrid}>
                      {(selectedCat.imagens || []).map((img) => (
                        <div className={styles.previewItem} key={img.id}>
                          <img src={img.imagem_url} alt={img.descricao || img.nome || ''} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className={styles.empty}>Nenhuma imagem nesta categoria.</p>
                  )}
                </div>
              ) : (
                <p className={styles.empty}>Selecione uma categoria acima.</p>
              )}
            </>
          ) : <p className={styles.empty}>Nenhuma categoria para pré-visualizar.</p>}
        </section>
      )}
    </>
  )
}