import { useState, useRef } from 'react'
import { api } from '../../../services/api'
import ImageCard from '../../../components/ImageCard/ImageCard'
import styles from '../cores/Colecoes.module.css'

export default function ColecaoTab({ colecaos, loadColecaos, setError, showToast }) {
  const [view, setView] = useState('manage')
  const [colNome, setColNome] = useState('')
  const [colImagem, setColImagem] = useState(null)
  const [colPreview, setColPreview] = useState(null)
  const [colOrdem, setColOrdem] = useState('')
  const [editingCol, setEditingCol] = useState(null)
  const [uploadingCol, setUploadingCol] = useState(false)
  const [dropActive, setDropActive] = useState(false)
  const fileInputRef = useRef(null)

  const colecoesOrdenadas = [...colecaos].sort(
    (a, b) => (a.ordem ?? 0) - (b.ordem ?? 0) || a.nome.localeCompare(b.nome)
  )

  const isObjectURL = (url) => typeof url === 'string' && url.startsWith('blob:')

  const clearColFile = () => {
    setColImagem(null)
    if (isObjectURL(colPreview)) URL.revokeObjectURL(colPreview)
    setColPreview(editingCol?.imagem_url || null)
  }

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return
    if (isObjectURL(colPreview)) URL.revokeObjectURL(colPreview)
    setColImagem(file)
    setColPreview(file ? URL.createObjectURL(file) : null)
  }

  const handleColecaoSubmit = async (e) => {
    e.preventDefault()
    if (uploadingCol) return
    setError(''); setUploadingCol(true)
    try {
      if (editingCol) {
        await api.updateColecao(editingCol.id, colNome, colImagem, colOrdem)
        showToast('success', 'Coleção atualizada!')
      } else {
        await api.createColecao(colNome, colImagem, colOrdem)
        showToast('success', 'Coleção criada!')
      }
      setColNome(''); setColImagem(null); setColOrdem(''); setEditingCol(null)
      if (isObjectURL(colPreview)) URL.revokeObjectURL(colPreview)
      setColPreview(null)
      loadColecaos()
    } catch (err) {
      showToast('error', err.message || 'Erro ao salvar coleção.')
    } finally { setUploadingCol(false) }
  }

  const handleDeleteColecao = async (id) => {
    if (!confirm('Deletar esta coleção?')) return
    try {
      await api.deleteColecao(id)
      loadColecaos()
    } catch (err) { setError(err.message) }
  }

  const startEditColecao = (col) => {
    setEditingCol(col)
    setColNome(col.nome)
    setColOrdem(String(col.ordem ?? ''))
    setColImagem(null)
    if (isObjectURL(colPreview)) URL.revokeObjectURL(colPreview)
    setColPreview(col.imagem_url || null)
  }

  const cancelEdit = () => {
    setEditingCol(null)
    setColNome('')
    setColOrdem('')
    clearColFile()
  }

  const moveColecao = async (index, dir) => {
    const target = index + dir
    if (target < 0 || target >= colecoesOrdenadas.length) return
    const a = colecoesOrdenadas[index]
    const b = colecoesOrdenadas[target]
    const ordemA = a.ordem ?? 0
    const ordemB = b.ordem ?? 0
    try {
      await api.updateColecao(a.id, a.nome, null, ordemB)
      await api.updateColecao(b.id, b.nome, null, ordemA)
      loadColecaos()
    } catch (err) { setError(err.message) }
  }

  return (
    <>
      <div className={styles.viewToggle}>
        <button
          className={view === 'manage' ? styles.active : ''}
          onClick={() => setView('manage')}
        >
          Gerenciar
        </button>
        <button
          className={view === 'preview' ? styles.active : ''}
          onClick={() => setView('preview')}
        >
          Prévia da Home
        </button>
      </div>

      {view === 'manage' ? (
        <div className={styles.manager}>
          <aside className={styles.formPanel}>
            <h3>{editingCol ? 'Editar' : 'Nova'} Coleção</h3>
            <form onSubmit={handleColecaoSubmit} className={styles.form}>
              <div className={styles.field}>
                <label htmlFor="colNome">Nome</label>
                <input
                  id="colNome"
                  type="text"
                  placeholder="Nome da coleção"
                  value={colNome}
                  onChange={(e) => setColNome(e.target.value)}
                  required
                />
              </div>

              <div
                className={`${styles.dropZone} ${dropActive ? styles.dropActive : ''}`}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDropActive(true) }}
                onDragLeave={() => setDropActive(false)}
                onDrop={(e) => {
                  e.preventDefault()
                  setDropActive(false)
                  handleFile(e.dataTransfer.files[0])
                }}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFile(e.target.files[0])}
                />
                {colPreview ? (
                  <>
                    <img src={colPreview} alt="Prévia" />
                    {editingCol && !colImagem && (
                      <span className={styles.keepOriginal}>Imagem atual mantida</span>
                    )}
                  </>
                ) : (
                  <div className={styles.dropHint}>
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" /><path d="M12 11v6m-3-3h6" strokeLinecap="round" /></svg>
                    <span>Arraste a imagem aqui ou clique para escolher</span>
                  </div>
                )}
              </div>

              <div className={styles.field}>
                <label htmlFor="colOrdem">Ordem de exibição</label>
                <input
                  id="colOrdem"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={colOrdem}
                  onChange={(e) => setColOrdem(e.target.value)}
                />
              </div>

              <div className={styles.formActions}>
                <button type="submit" className={styles.submit} disabled={uploadingCol}>
                  {uploadingCol ? 'Salvando...' : editingCol ? 'Salvar' : 'Criar'}
                </button>
                {editingCol && (
                  <button type="button" className={styles.cancel} onClick={cancelEdit}>
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </aside>

          <section>
            {colecoesOrdenadas.length > 0 ? (
              <div className={styles.grid}>
                {colecoesOrdenadas.map((col, i) => (
                  <div key={col.id} className={styles.card}>
                    <img
                      className={styles.thumb}
                      src={col.imagem_url || '/placeholder.svg'}
                      alt={col.nome}
                    />
                    <span className={styles.ordemBadge}>
                      {String(col.ordem ?? '').padStart(2, '0')}
                    </span>
                    <div className={styles.info}>
                      <h4>{col.nome}</h4>
                      <div className={styles.actions}>
                        <button
                          className={styles.actionBtn}
                          disabled={i === 0}
                          onClick={() => moveColecao(i, -1)}
                          aria-label="Mover para cima"
                        >
                          ↑
                        </button>
                        <button
                          className={styles.actionBtn}
                          disabled={i === colecoesOrdenadas.length - 1}
                          onClick={() => moveColecao(i, 1)}
                          aria-label="Mover para baixo"
                        >
                          ↓
                        </button>
                        <button
                          className={styles.actionBtn}
                          onClick={() => startEditColecao(col)}
                        >
                          Editar
                        </button>
                        <button
                          className={`${styles.actionBtn} ${styles.danger}`}
                          onClick={() => handleDeleteColecao(col.id)}
                        >
                          Excluir
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className={styles.empty}>Nenhuma coleção ainda. Crie uma ao lado.</p>
            )}
          </section>
        </div>
      ) : (
        <section className={styles.previewSection}>
          <div className={styles.previewHeader}>
            <h3>Prévia da página inicial</h3>
            <span className={styles.previewHint}>Layout igual à Home (masonry)</span>
          </div>
          {colecoesOrdenadas.length > 0 ? (
            <div className={styles.previewGrid}>
              {colecoesOrdenadas.map((img) => (
                <div key={img.id} className={styles.previewItem}>
                  <ImageCard imagem={img} />
                </div>
              ))}
            </div>
          ) : (
            <p className={styles.empty}>Nenhuma coleção para pré-visualizar.</p>
          )}
        </section>
      )}
    </>
  )
}