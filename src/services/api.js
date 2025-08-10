const API_BASE_URL = 'http://localhost:5000/api';

export const intakeAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/intakes`);
    if (!response.ok) throw new Error('Failed to fetch intakes');
    return response.json();
  },
  add: async (intake) => {
    const response = await fetch(`${API_BASE_URL}/intakes/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(intake)
    });
    if (!response.ok) throw new Error('Failed to add intake');
    return response.json();
  },
  update: async (id, intake) => {
    const response = await fetch(`${API_BASE_URL}/intakes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(intake)
    });
    if (!response.ok) throw new Error('Failed to update intake');
    return response.json();
  },
  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/intakes/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete intake');
    return response.json();
  }
};

export const profileAPI = {
  get: async () => {
    const response = await fetch(`${API_BASE_URL}/profile`);
    if (!response.ok) throw new Error('Failed to fetch profile');
    return response.json();
  },
  update: async (profile) => {
    const response = await fetch(`${API_BASE_URL}/profile/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile)
    });
    if (!response.ok) throw new Error('Failed to update profile');
    return response.json();
  }
};

export const proteinAPI = {
  getForDate: async (date) => {
    const response = await fetch(`${API_BASE_URL}/protein/${date}`);
    if (!response.ok) throw new Error('Failed to fetch protein log');
    return response.json();
  },
  log: async (data) => {
    const response = await fetch(`${API_BASE_URL}/protein/log`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to log protein');
    return response.json();
  }
};

export const clarifaiAPI = {
  analyzeUpload: async (file) => {
    const formData = new FormData();
    formData.append('imageFile', file);

    const res = await fetch('http://localhost:5000/api/clarifai/analyze-upload', {
      method: 'POST',
      body: formData
    });

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
  }
};
