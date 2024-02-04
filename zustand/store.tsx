import { create } from 'zustand'

type StoreState = {
  modelJson: any
  labelPath: string
  modelWeight: string
  setModelJson: (modelPath: any) => void
  setLabelPath: (labelPath: string) => void
  setModelWeight: (modelWeight: string) => void
};

const useStore = create<StoreState>((set) => ({
  modelJson: '',
  labelPath: '',
  modelWeight: '',
  setModelJson: (modelJson: any) => set({ modelJson }),
  setLabelPath: (labelPath: string) => set({ labelPath }),
  setModelWeight: (modelWeight: string) => set({ modelWeight })
}))

export default useStore;
