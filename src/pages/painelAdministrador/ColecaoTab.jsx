import { useState } from 'react'
import { api } from '../../services/api'
import styles from './Painel.module.css'

export default function ColecaoTab({ colecaos, loadColecaos, setError, showToast }) {
  const [colNome, setColNome] = useState('')
  const [colImagem, setColImagem] = useState(null)
  const [colPreview, setColPreview] = useState(null)
  const [colOrdem, setColOrdem] = useState('')
  const [editingCol, setEditingCol] = useState(null)
  const [uploadingCol, setUploadingCol] = useState(false)

  const colecaosOrdenadas = [...colecaos].sort(
    (a, b) => (a.ordem ?? 0) - (b.ordem ?? 0) || a.nome.localeCompare(b.nome)
  )

  const clearColFile = () => {
    setColImagem(null)
    if (colPreview) { URL.revokeObjectURL(colPreview); setColPreview(null) }
  }

  const handleColecaoSubmit = async (e) => {
    e.preventDefault()
    if (uploadingCol) return
    setError(''); setUploadingCol(true)
    try {
      if (editingCol) {
        await api.updateColecao(editingCol.id, colNome, colImagem, colOrdem)
        showToast('success', 'Colecao atualizada!')
      } else {
        await api.createColecao(colNome, colImagem, colOrdem)
        showToast('success', 'Colecao criada!')
      }
      setColNome(''); clearColFile(); setColOrdem(''); setEditingCol(null)
      loadColecaos()
    } catch (err) {
      showToast('error', err.message || 'Erro ao salvar colecao.')
    } finally { setUploadingCol(false) }
  }

  const handleDeleteColecao = async (id) => {
    if (!confirm('Deletar esta colecao?')) return
    try {
      await api.deleteColecao(id)
      loadColecaos()
    } catch (err) { setError(err.message) }
  }

  const startEditColecao = (col) => {
    setEditingCol(col); setColNome(col.nome); setColOrdem(String(col.ordem ?? '')); clearColFile()
  }

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <h3>Colecoes</h3>
        <ul className={styles.catList}>
          {colecaosOrdenadas.map((col) => (
            <li key={col.id}>
              <button>
                {String(col.ordem ?? '').padStart(2, '0')} · {col.nome}
              </button>
              <div className={styles.catActions}>
                <button className={styles.sm} onClick={() => startEditColecao(col)}>Editar</button>
                <button className={styles.danger} onClick={() => handleDeleteColecao(col.id)}>X</button>
              </div>
            </li>
          ))}
        </ul>

        <form onSubmit={handleColecaoSubmit} className={styles.form}>
          <h4>{editingCol ? 'Editar' : 'Nova'} Colecao</h4>
          <input type="text" placeholder="Nome" value={colNome} onChange={(e) => setColNome(e.target.value)} required />
          <label className={styles.uploadZone}>
            <input type="file" accept="image/*" className={styles.fileInput} onChange={(e) => { const f = e.target.files[0]; setColImagem(f); if (colPreview) URL.revokeObjectURL(colPreview); setColPreview(f ? URL.createObjectURL(f) : null) }} />
            {colPreview ? <img src={colPreview} alt="Previa" /> : (
              <><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" /><path d="M12 11v6m-3-3h6" strokeLinecap="round" /></svg><span>{editingCol ? 'Trocar imagem' : 'Escolher imagem'}</span></>
            )}
          </label>
          <input type="number" min="0" placeholder="Ordem de exibicao" value={colOrdem} onChange={(e) => setColOrdem(e.target.value)} className={styles.ordemInput} />
          <div className={styles.formActions}>
            <button type="submit">{editingCol ? 'Salvar' : 'Criar'}</button>
            {editingCol && <button type="button" className={styles.secondary} onClick={() => { setEditingCol(null); setColNome(''); setColOrdem(''); clearColFile() }}>Cancelar</button>}
          </div>
          {uploadingCol && <div className={styles.sendingOverlay}><span className={styles.spinner} /><p>Salvando...</p></div>}
        </form>
      </aside>

      <main className={styles.main}>
        <div className={styles.imagesGrid}>
          {colecaosOrdenadas.map((col) => (
            <div key={col.id} className={styles.imageCard}>
              <img src={col.imagem_url || '/placeholder.svg'} alt={col.nome} />
              <h4>{col.nome}</h4>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
