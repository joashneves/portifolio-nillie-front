import { useState } from 'react'
import { api } from '../../services/api'
import styles from './Painel.module.css'

export default function CategoriaTab({ categorias, setError, showToast }) {
  const [selectedCat, setSelectedCat] = useState(null)
  const [imgNome, setImgNome] = useState('')
  const [imgDescricao, setImgDescricao] = useState('')
  const [imgImagem, setImgImagem] = useState(null)
  const [imgPreview, setImgPreview] = useState(null)
  const [editingImg, setEditingImg] = useState(null)
  const [uploading, setUploading] = useState(false)

  const categoriasOrdenadas = [...categorias].sort(
    (a, b) => (a.ordem ?? 0) - (b.ordem ?? 0) || a.nome.localeCompare(b.nome)
  )

  const loadCategoria = async (id) => {
    const data = await api.getCategoria(id)
    setSelectedCat(data)
  }

  const clearImgFile = () => {
    setImgImagem(null)
    if (imgPreview) { URL.revokeObjectURL(imgPreview); setImgPreview(null) }
  }

  const handleImagenSubmit = async (e) => {
    e.preventDefault()
    if (!selectedCat || uploading) return
    setError(''); setUploading(true)
    try {
      const data = { nome: imgNome, descricao: imgDescricao }
      if (editingImg) {
        await api.updateImagen(selectedCat.id, editingImg.id, data, imgImagem)
        showToast('success', 'Imagem atualizada!')
      } else {
        await api.createImagen(selectedCat.id, data, imgImagem)
        showToast('success', 'Imagem enviada!')
      }
      setImgNome(''); setImgDescricao(''); clearImgFile(); setEditingImg(null)
      loadCategoria(selectedCat.id)
    } catch (err) {
      showToast('error', err.message || 'Erro ao enviar imagem.')
    } finally { setUploading(false) }
  }

  const handleDeleteImagen = async (imagenId) => {
    if (!selectedCat) return
    if (!confirm('Deletar esta imagem?')) return
    try { await api.deleteImagen(selectedCat.id, imagenId); loadCategoria(selectedCat.id) }
    catch (err) { setError(err.message) }
  }

  const startEditImagen = (img) => {
    setEditingImg(img); setImgNome(img.nome); setImgDescricao(img.descricao || ''); clearImgFile()
  }

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <h3>Categorias</h3>
        <ul className={styles.catList}>
          {categoriasOrdenadas.map((cat) => (
            <li key={cat.id} className={selectedCat?.id === cat.id ? styles.active : ''}>
              <button onClick={() => loadCategoria(cat.id)}>
                {String(cat.ordem ?? '').padStart(2, '0')} · {cat.nome}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <main className={styles.main}>
        {selectedCat ? (
          <>
            <h3>Imagens de: {selectedCat.nome}</h3>

            <form onSubmit={handleImagenSubmit} className={styles.form}>
              <h4>{editingImg ? 'Editar' : 'Nova'} Imagem</h4>
              <input type="text" placeholder="Nome" value={imgNome} onChange={(e) => setImgNome(e.target.value)} required />
              <textarea placeholder="Descricao" value={imgDescricao} onChange={(e) => setImgDescricao(e.target.value)} />
              <label className={styles.uploadZone}>
                <input type="file" accept="image/*" className={styles.fileInput} onChange={(e) => { const f = e.target.files[0]; setImgImagem(f); if (imgPreview) URL.revokeObjectURL(imgPreview); setImgPreview(f ? URL.createObjectURL(f) : null) }} />
                {imgPreview ? <img src={imgPreview} alt="Previa" /> : (
                  <><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" /><path d="M12 11v6m-3-3h6" strokeLinecap="round" /></svg><span>{editingImg ? 'Trocar imagem' : 'Escolher imagem'}</span></>
                )}
              </label>
              <div className={styles.formActions}>
                <button type="submit">{editingImg ? 'Salvar' : 'Criar'}</button>
                {editingImg && <button type="button" className={styles.secondary} onClick={() => { setEditingImg(null); setImgNome(''); setImgDescricao(''); clearImgFile() }}>Cancelar</button>}
              </div>
              {uploading && <div className={styles.sendingOverlay}><span className={styles.spinner} /><p>Enviando...</p></div>}
            </form>

            {selectedCat.imagens?.length > 0 ? (
              <div className={styles.imagesGrid}>
                {selectedCat.imagens.map((img) => (
                  <div key={img.id} className={styles.imageCard}>
                    <img src={img.imagem_url || '/placeholder.svg'} alt={img.nome} />
                    <h4>{img.nome}</h4>
                    {img.descricao && <p>{img.descricao}</p>}
                    <div className={styles.cardActions}>
                      <button className={styles.sm} onClick={() => startEditImagen(img)}>Editar</button>
                      <button className={`${styles.sm} ${styles.danger}`} onClick={() => handleDeleteImagen(img.id)}>Excluir</button>
                    </div>
                  </div>
                ))}
              </div>
            ) : <p>Nenhuma imagem ainda.</p>}
          </>
        ) : <p className={styles.noSelection}>Selecione uma categoria ao lado.</p>}
      </main>
    </div>
  )
}
