import { create } from 'zustand'

type StoreState = {
  modelPath: string
  labelPath: string
  modelWeightPath: string
  setModelPath: (modelPath: string) => void
  setLabelPath: (labelPath: string) => void
  setModelWeightPath: (modelWeightPath: string) => void
};

const useStore = create<StoreState>((set) => ({
  modelPath: '',
  labelPath: '',
  modelWeightPath: '',
  setModelPath: (modelPath: any) => set({ modelPath }),
  setLabelPath: (labelPath: string) => set({ labelPath }),
  setModelWeightPath: (modelWeightPath: string) => set({ modelWeightPath })
}))

export default useStore;
