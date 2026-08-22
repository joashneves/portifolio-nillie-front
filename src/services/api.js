const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'

async function request(path, options = {}) {
  const token = localStorage.getItem('token')
  const headers = { ...options.headers }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers })

  if (res.status === 204) return null

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || data.errors?.join(', ') || 'Request failed')
  }

  return data
}

export const api = {
  // Auth
  login: (username, password) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),

  register: (username, password, passwordConfirmation) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        username,
        password,
        password_confirmation: passwordConfirmation,
      }),
    }),

  logout: () => request('/auth/logout', { method: 'DELETE' }),

  // User
  getUser: () => request('/user'),

  updateUser: (data) =>
    request('/user', { method: 'PATCH', body: JSON.stringify(data) }),

  updateAvatar: (file) => {
    const formData = new FormData()
    formData.append('avatar', file)
    return request('/user/update_avatar', { method: 'POST', body: formData })
  },

  // Categorias
  getCategorias: () => request('/categorias_de_imagens'),

  getCategoria: (id) => request(`/categorias_de_imagens/${id}`),

  createCategoria: (nome, imagem, ordem) => {
    const formData = new FormData()
    formData.append('nome', nome)
    if (ordem !== '' && ordem != null) formData.append('ordem', ordem)
    if (imagem) formData.append('imagem', imagem)
    return request('/categorias_de_imagens', { method: 'POST', body: formData })
  },

  updateCategoria: (id, nome, imagem, ordem) => {
    const formData = new FormData()
    formData.append('nome', nome)
    if (ordem !== '' && ordem != null) formData.append('ordem', ordem)
    if (imagem) formData.append('imagem', imagem)
    return request(`/categorias_de_imagens/${id}`, {
      method: 'PATCH',
      body: formData,
    })
  },

  deleteCategoria: (id) =>
    request(`/categorias_de_imagens/${id}`, { method: 'DELETE' }),

  // Imagens
  getImagens: (categoriaId) =>
    request(`/categorias_de_imagens/${categoriaId}/imagens`),

  getImagen: (categoriaId, id) =>
    request(`/categorias_de_imagens/${categoriaId}/imagens/${id}`),

  createImagen: (categoriaId, data, imagem) => {
    const formData = new FormData()
    formData.append('nome', data.nome)
    formData.append('descricao', data.descricao)
    if (imagem) formData.append('imagem', imagem)
    return request(`/categorias_de_imagens/${categoriaId}/imagens`, {
      method: 'POST',
      body: formData,
    })
  },

  updateImagen: (categoriaId, id, data, imagem) => {
    const formData = new FormData()
    formData.append('nome', data.nome)
    formData.append('descricao', data.descricao)
    if (imagem) formData.append('imagem', imagem)
    return request(`/categorias_de_imagens/${categoriaId}/imagens/${id}`, {
      method: 'PATCH',
      body: formData,
    })
  },

  deleteImagen: (categoriaId, id) =>
    request(`/categorias_de_imagens/${categoriaId}/imagens/${id}`, {
      method: 'DELETE',
    }),
}
