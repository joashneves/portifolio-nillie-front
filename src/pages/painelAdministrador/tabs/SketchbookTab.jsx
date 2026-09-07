import { useState } from 'react'
import { api } from '../../../services/api'
import ImageCard from '../../../components/ImageCard/ImageCard'
import styles from '../cores/SketchbookTab.module.css'

export default function SketchbookTab({ sketchbook, loadSketchbook, setError, showToast }) {
  const [skNome, setSkNome] = useState(sketchbook?.nome || '')
  const [skImagem, setSkImagem] = useState(null)
  const [skPreview, setSkPreview] = useState(sketchbook?.imagem_url || null)
  const [savingSk, setSavingSk] = useState(false)
  const [skDropActive, setSkDropActive] = useState(false)

  const [imgNome, setImgNome] = useState('')
  const [imgDescricao, setImgDescricao] = useState('')
  const [imgImagem, setImgImagem] = useState(null)
  const [imgPreview, setImgPreview] = useState(null)
  const [editingImg, setEditingImg] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [dropActive, setDropActive] = useState(false)

  const imagens = sketchbook?.imagens || []

  const isObjectURL = (url) => typeof url === 'string' && url.startsWith('blob:')

  const handleSkFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return
    if (isObjectURL(skPreview)) URL.revokeObjectURL(skPreview)
    setSkImagem(file)
    setSkPreview(URL.createObjectURL(file))
  }

  const handleSkSubmit = async (e) => {
    e.preventDefault()
    if (savingSk) return
    setError(''); setSavingSk(true)
    try {
      if (sketchbook) {
        await api.updateSketchbook(sketchbook.id, skNome, skImagem, sketchbook.ordem)
        showToast('success', 'Sketchbook atualizado!')
      } else {
        await api.createSketchbook(skNome, skImagem)
        showToast('success', 'Sketchbook criado!')
      }
      setSkImagem(null)
      await loadSketchbook()
    } catch (err) {
      showToast('error', err.message || 'Erro ao salvar sketchbook.')
    } finally { setSavingSk(false) }
  }

  const clearImgFile = () => {
    setImgImagem(null)
    if (isObjectURL(imgPreview)) URL.revokeObjectURL(imgPreview)
    setImgPreview(editingImg?.imagem_url || null)
  }

  const resetImgForm = () => {
    setImgNome(''); setImgDescricao(''); setEditingImg(null)
    setImgImagem(null)
    if (isObjectURL(imgPreview)) URL.revokeObjectURL(imgPreview)
    setImgPreview(null)
  }

  const handleImgFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return
    if (isObjectURL(imgPreview)) URL.revokeObjectURL(imgPreview)
    setImgImagem(file)
    setImgPreview(URL.createObjectURL(file))
  }

  const handleImgSubmit = async (e) => {
    e.preventDefault()
    if (!sketchbook || uploading) return
    setError(''); setUploading(true)
    try {
      const data = { nome: imgNome, descricao: imgDescricao }
      if (editingImg) {
        await api.updateImagemDeSketchbook(sketchbook.id, editingImg.id, data, imgImagem)
        showToast('success', 'Imagem atualizada!')
      } else {
        await api.createImagemDeSketchbook(sketchbook.id, data, imgImagem)
        showToast('success', 'Imagem enviada!')
      }
      resetImgForm()
      await loadSketchbook()
    } catch (err) {
      showToast('error', err.message || 'Erro ao enviar imagem.')
    } finally { setUploading(false) }
  }

  const handleDeleteImg = async (imgId) => {
    if (!confirm('Deletar esta imagem?')) return
    try {
      await api.deleteImagemDeSketchbook(sketchbook.id, imgId)
      await loadSketchbook()
    } catch (err) { setError(err.message) }
  }

  const startEditImg = (img) => {
    setEditingImg(img); setImgNome(img.nome); setImgDescricao(img.descricao || ''); clearImgFile()
  }

  return (
    <>
      <aside className={styles.formPanel}>
        <h3>{sketchbook ? 'Editar' : 'Criar'} Sketchbook</h3>
        <form onSubmit={handleSkSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="skNome">Nome</label>
            <input id="skNome" type="text" placeholder="Sketchbook" value={skNome} onChange={(e) => setSkNome(e.target.value)} required />
          </div>
          <div
            className={`${styles.dropZone} ${skDropActive ? styles.dropActive : ''}`}
            onClick={() => document.getElementById('skCapaFile').click()}
            onDragOver={(e) => { e.preventDefault(); setSkDropActive(true) }}
            onDragLeave={() => setSkDropActive(false)}
            onDrop={(e) => { e.preventDefault(); setSkDropActive(false); handleSkFile(e.dataTransfer.files[0]) }}
          >
            <input id="skCapaFile" type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleSkFile(e.target.files[0])} />
            {skPreview ? <img src={skPreview} alt="Capa do sketchbook" /> : (
              <div className={styles.dropHint}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" /><path d="M12 11v6m-3-3h6" strokeLinecap="round" /></svg>
                <span>Arraste a imagem aqui ou clique para escolher</span>
              </div>
            )}
          </div>
          <div className={styles.formActions}>
            <button type="submit" className={styles.submit} disabled={savingSk}>
              {savingSk ? 'Salvando...' : sketchbook ? 'Salvar' : 'Criar'}
            </button>
          </div>
        </form>
      </aside>

      {sketchbook && (
        <section className={styles.imagesSection}>
          <div className={styles.imagesHeader}>
            <h3>Imagens do Sketchbook</h3>
            <span className={styles.badge}>{imagens.length} imagem(ens)</span>
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
                onClick={() => document.getElementById('skImgFile').click()}
                onDragOver={(e) => { e.preventDefault(); setDropActive(true) }}
                onDragLeave={() => setDropActive(false)}
                onDrop={(e) => { e.preventDefault(); setDropActive(false); handleImgFile(e.dataTransfer.files[0]) }}
              >
                <input id="skImgFile" type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleImgFile(e.target.files[0])} />
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
              )) : <p className={styles.empty}>Nenhuma imagem neste sketchbook.</p>}
            </div>
          </div>
        </section>
      )}
    </>
  )
}