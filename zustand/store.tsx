import { create } from 'zustand'

type StoreState = {
  modelPath: string;
  labelPath: string;
  setModelPath: (modelPath: string) => void
  setLabelPath: (labelPath: string) => void
};

const useStore = create<StoreState>((set) => ({
  modelPath: '',
  labelPath: '',
  setModelPath: (modelPath: string) => set({ modelPath }),
  setLabelPath: (labelPath: string) => set({ labelPath }),
}))

export default useStore;
