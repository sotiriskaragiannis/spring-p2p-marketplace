import axios from 'axios';

const API_URL = 'http://localhost:8080'; // Replace with your actual API URL

export const fetchListings = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching listings:', error);
    throw error;
  }
};

export const fetchListingById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching listing with id ${id}:`, error);
    throw error;
  }
};

export const createListing = async (listingData) => {
  try {
    const response = await axios.post(API_URL, listingData);
    return response.data;
  } catch (error) {
    console.error('Error creating listing:', error);
    throw error;
  }
};

export const updateListing = async (id, listingData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, listingData);
    return response.data;
  } catch (error) {
    console.error(`Error updating listing with id ${id}:`, error);
    throw error;
  }
};

export const deleteListing = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error(`Error deleting listing with id ${id}:`, error);
    throw error;
  }
};