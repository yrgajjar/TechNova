import { AppData } from '../types';
import { DEFAULT_DATA } from '../data/defaults';

const STORAGE_KEY = 'technova_site_data';

export const getAppData = (): AppData => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to load from local storage', e);
  }
  return DEFAULT_DATA;
};

export const saveAppData = (data: AppData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save to local storage', e);
  }
};

export const resetToDefaults = (): AppData => {
  localStorage.removeItem(STORAGE_KEY);
  return DEFAULT_DATA;
};
