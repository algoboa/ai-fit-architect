import { useProgressStore } from '../../src/store/progressStore';
import { act } from '@testing-library/react-native';

// Mock Firebase
jest.mock('../../src/services/firebase', () => ({
  db: {},
}));

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  addDoc: jest.fn(() => Promise.resolve({ id: 'mock-doc-id' })),
  getDocs: jest.fn(() =>
    Promise.resolve({
      docs: [
        {
          id: '1',
          data: () => ({
            weight: 75,
            bodyFat: 20,
            muscleMass: 33,
            createdAt: { toDate: () => new Date('2025-01-01') },
          }),
        },
        {
          id: '2',
          data: () => ({
            weight: 74,
            bodyFat: 19,
            muscleMass: 34,
            createdAt: { toDate: () => new Date('2025-01-08') },
          }),
        },
      ],
    })
  ),
  query: jest.fn(),
  orderBy: jest.fn(),
  where: jest.fn(),
  Timestamp: {
    now: jest.fn(() => ({ toDate: () => new Date() })),
    fromDate: jest.fn((date) => ({ toDate: () => date })),
  },
  limit: jest.fn(),
}));

describe('progressStore', () => {
  beforeEach(() => {
    useProgressStore.getState().resetStore();
  });

  describe('initial state', () => {
    it('should have correct initial values', () => {
      const state = useProgressStore.getState();

      expect(state.bodyMeasurements).toEqual([]);
      expect(state.weightHistory).toEqual([]);
      expect(state.bodyFatHistory).toEqual([]);
      expect(state.muscleHistory).toEqual([]);
      expect(state.performanceData).toEqual([]);
      expect(state.weeklyVolume).toEqual([]);
      expect(state.personalRecords).toEqual({});
      expect(state.achievements).toEqual([]);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });
  });

  describe('fetchBodyMeasurements', () => {
    it('should set isLoading to true while fetching', async () => {
      const { fetchBodyMeasurements } = useProgressStore.getState();

      const promise = fetchBodyMeasurements('test-user-id', '1m');

      expect(useProgressStore.getState().isLoading).toBe(true);

      await promise;

      expect(useProgressStore.getState().isLoading).toBe(false);
    });

    it('should populate weight history from measurements', async () => {
      const { fetchBodyMeasurements } = useProgressStore.getState();

      await fetchBodyMeasurements('test-user-id', '1m');

      const state = useProgressStore.getState();
      expect(state.weightHistory.length).toBeGreaterThan(0);
      expect(state.weightHistory[0]).toHaveProperty('date');
      expect(state.weightHistory[0]).toHaveProperty('value');
    });

    it('should populate body fat history from measurements', async () => {
      const { fetchBodyMeasurements } = useProgressStore.getState();

      await fetchBodyMeasurements('test-user-id', '1m');

      const state = useProgressStore.getState();
      expect(state.bodyFatHistory.length).toBeGreaterThan(0);
    });

    it('should populate muscle history from measurements', async () => {
      const { fetchBodyMeasurements } = useProgressStore.getState();

      await fetchBodyMeasurements('test-user-id', '1m');

      const state = useProgressStore.getState();
      expect(state.muscleHistory.length).toBeGreaterThan(0);
    });
  });

  describe('addBodyMeasurement', () => {
    it('should add a new measurement', async () => {
      const { addBodyMeasurement } = useProgressStore.getState();

      const result = await addBodyMeasurement('test-user-id', {
        weight: 73,
        bodyFat: 18,
      });

      expect(result).toBe('mock-doc-id');
    });

    it('should set loading state while adding', async () => {
      const { addBodyMeasurement } = useProgressStore.getState();

      const promise = addBodyMeasurement('test-user-id', { weight: 73 });

      expect(useProgressStore.getState().isLoading).toBe(true);

      await promise;
    });
  });

  describe('getLatestStats', () => {
    it('should return latest stats with changes', async () => {
      const { fetchBodyMeasurements, getLatestStats } = useProgressStore.getState();

      await fetchBodyMeasurements('test-user-id', '1m');

      const stats = getLatestStats();

      expect(stats).toHaveProperty('weight');
      expect(stats.weight).toHaveProperty('current');
      expect(stats.weight).toHaveProperty('change');
      expect(stats).toHaveProperty('bodyFat');
      expect(stats).toHaveProperty('muscle');
      expect(stats).toHaveProperty('personalRecords');
    });

    it('should return zero values when no data', () => {
      const { getLatestStats } = useProgressStore.getState();

      const stats = getLatestStats();

      expect(stats.weight.current).toBe(0);
      expect(stats.weight.change).toBe(0);
    });
  });

  describe('calculate1RM', () => {
    it('should return weight if reps is 1', () => {
      const { calculate1RM } = useProgressStore.getState();

      expect(calculate1RM(100, 1)).toBe(100);
    });

    it('should calculate 1RM using Epley formula', () => {
      const { calculate1RM } = useProgressStore.getState();

      // Epley formula: weight * (1 + reps/30)
      // 100 * (1 + 10/30) = 100 * 1.333 = 133
      expect(calculate1RM(100, 10)).toBe(133);
    });

    it('should calculate correctly for different inputs', () => {
      const { calculate1RM } = useProgressStore.getState();

      // 60kg for 8 reps = 60 * (1 + 8/30) = 60 * 1.267 = 76
      expect(calculate1RM(60, 8)).toBe(76);
    });
  });

  describe('resetStore', () => {
    it('should reset all state to initial values', async () => {
      const { fetchBodyMeasurements, resetStore } = useProgressStore.getState();

      await fetchBodyMeasurements('test-user-id', '1m');

      expect(useProgressStore.getState().bodyMeasurements.length).toBeGreaterThan(0);

      resetStore();

      const state = useProgressStore.getState();
      expect(state.bodyMeasurements).toEqual([]);
      expect(state.weightHistory).toEqual([]);
      expect(state.isLoading).toBe(false);
    });
  });
});
