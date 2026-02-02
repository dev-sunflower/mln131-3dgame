import { create } from 'zustand';

// Types
export interface KnowledgeItem {
  id: string;
  title: string;
  titleVi: string;
  content: string;
  contentVi: string;
  found: boolean;
}

export interface InventoryItem {
  id: string;
  name: string;
  nameVi: string;
  description: string;
  icon: string;
}

export interface Room1PuzzleState {
  dialPositions: number[]; // 4 dials, each 0-3 positions
  manifestoFound: boolean;
  boxOpened: boolean;
  keyObtained: boolean;
}

export interface Room2PuzzleState {
  gearsPlaced: { [slotId: string]: string | null }; // slot -> gear id
  gearsCollected: string[];
  machineActivated: boolean;
}

// Core status for Room 3
export type CoreStatus = 'locked' | 'unlocked' | 'assembled';

export interface Room3PuzzleState {
  cores: Record<string, { status: CoreStatus }>;
  devicePowered: boolean;
  badgeObtained: boolean;
}

interface GameStore {
  // Game state
  gameStarted: boolean;
  gameComplete: boolean;

  // Room navigation
  currentRoom: number;
  roomsCompleted: boolean[];
  isTransitioning: boolean;

  // Examine mode
  examineMode: boolean;
  examinedObject: string | null;

  // Inventory
  inventory: InventoryItem[];
  selectedItem: string | null;

  // Knowledge
  knowledge: KnowledgeItem[];
  sidebarOpen: boolean;
  selectedKnowledge: KnowledgeItem | null;

  // Puzzle states
  room1State: Room1PuzzleState;
  room2State: Room2PuzzleState;
  room3State: Room3PuzzleState;

  // UI
  showHint: boolean;
  showIntro: boolean;
  soundEnabled: boolean;
  language: 'en' | 'vi';

  // Actions
  startGame: () => void;
  completeGame: () => void;

  setCurrentRoom: (room: number) => void;
  completeRoom: (room: number) => void;
  setTransitioning: (value: boolean) => void;

  enterExamineMode: (objectId: string) => void;
  exitExamineMode: () => void;

  addToInventory: (item: InventoryItem) => void;
  removeFromInventory: (itemId: string) => void;
  selectInventoryItem: (itemId: string | null) => void;

  addKnowledge: (id: string) => void;
  toggleSidebar: () => void;
  setSelectedKnowledge: (item: KnowledgeItem | null) => void;

  // Room 1 actions
  setDialPosition: (dialIndex: number, position: number) => void;
  findManifesto: () => void;
  openBox: () => void;
  obtainRoom1Key: () => void;

  // Room 2 actions
  collectGear: (gearId: string) => void;
  placeGear: (slotId: string, gearId: string) => void;
  removeGear: (slotId: string) => void;
  activateMachine: () => void;

  // Room 3 actions
  unlockCore: (coreId: string) => void;
  assembleCore: (coreId: string) => void;
  obtainBadge: () => void;

  // UI actions
  toggleHint: () => void;
  toggleSound: () => void;
  setLanguage: (lang: 'en' | 'vi') => void;
  resetRoom: (room: number) => void;
  returnToIntro: () => void;
}

// Initial knowledge data
const initialKnowledge: KnowledgeItem[] = [
  {
    id: 'manifesto',
    title: 'The Communist Manifesto',
    titleVi: 'Tuyên ngôn của Đảng Cộng sản',
    content: 'Written by Karl Marx and Friedrich Engels in 1848, this foundational text outlines the theory of class struggle and the inevitable transition from capitalism to socialism and eventually communism.',
    contentVi: 'Được viết bởi Karl Marx và Friedrich Engels năm 1848, văn bản nền tảng này phác thảo lý thuyết về đấu tranh giai cấp và sự chuyển đổi tất yếu từ chủ nghĩa tư bản sang chủ nghĩa xã hội và cuối cùng là chủ nghĩa cộng sản.',
    found: false,
  },
  {
    id: 'objective',
    title: 'Objective Conditions',
    titleVi: 'Điều kiện khách quan',
    content: 'The material and economic conditions necessary for socialist revolution: highly developed productive forces, advanced capitalism creating its own gravediggers - the proletariat class.',
    contentVi: 'Các điều kiện vật chất và kinh tế cần thiết cho cách mạng xã hội chủ nghĩa: lực lượng sản xuất phát triển cao, chủ nghĩa tư bản tiên tiến tạo ra những người đào mồ chôn chính nó - giai cấp vô sản.',
    found: false,
  },
  {
    id: 'subjective',
    title: 'Subjective Conditions',
    titleVi: 'Điều kiện chủ quan',
    content: 'The consciousness and organization of the working class: class awareness, revolutionary party leadership, and the willingness to transform society.',
    contentVi: 'Ý thức và tổ chức của giai cấp công nhân: ý thức giai cấp, sự lãnh đạo của đảng cách mạng và sự sẵn sàng cải tạo xã hội.',
    found: false,
  },
  {
    id: 'transition',
    title: 'The Transition Period',
    titleVi: 'Thời kỳ quá độ',
    content: 'The period between capitalism and full communism where society undergoes fundamental transformation in economy, politics, social relations, and culture under the dictatorship of the proletariat.',
    contentVi: 'Giai đoạn giữa chủ nghĩa tư bản và chủ nghĩa cộng sản hoàn chỉnh, nơi xã hội trải qua sự chuyển đổi căn bản về kinh tế, chính trị, quan hệ xã hội và văn hóa dưới chuyên chính vô sản.',
    found: false,
  },
  {
    id: 'vietnam',
    title: "Vietnam's Path",
    titleVi: 'Con đường Việt Nam',
    content: "Vietnam's socialist-oriented market economy combines market mechanisms with socialist orientation, maintaining Communist Party leadership while embracing innovation and global integration.",
    contentVi: 'Kinh tế thị trường định hướng xã hội chủ nghĩa của Việt Nam kết hợp cơ chế thị trường với định hướng xã hội chủ nghĩa, duy trì sự lãnh đạo của Đảng Cộng sản đồng thời đón nhận đổi mới và hội nhập toàn cầu.',
    found: false,
  },
  {
    id: 'fpt',
    title: 'FPT Spirit & Innovation',
    titleVi: 'Tinh thần FPT & Đổi mới sáng tạo',
    content: 'FPT students represent the new generation driving digital transformation, startup culture, and social innovation - key forces in building a modern socialist society.',
    contentVi: 'Sinh viên FPT đại diện cho thế hệ mới thúc đẩy chuyển đổi số, văn hóa khởi nghiệp và đổi mới xã hội - những lực lượng then chốt trong xây dựng xã hội xã hội chủ nghĩa hiện đại.',
    found: false,
  },
];

export const useGameState = create<GameStore>((set, get) => ({
  // Initial state
  gameStarted: false,
  gameComplete: false,

  currentRoom: 2,
  roomsCompleted: [false, false, false],
  isTransitioning: false,

  examineMode: false,
  examinedObject: null,

  inventory: [],
  selectedItem: null,

  knowledge: initialKnowledge,
  sidebarOpen: false,
  selectedKnowledge: null,

  room1State: {
    dialPositions: [0, 0, 0, 0],
    manifestoFound: false,
    boxOpened: false,
    keyObtained: false,
  },

  room2State: {
    gearsPlaced: {
      economy: null,
      politics: null,
      social: null,
      culture: null,
    },
    gearsCollected: [],
    machineActivated: false,
  },

  room3State: {
    cores: {
      innovation: { status: 'locked' },
      digital: { status: 'locked' },
      justice: { status: 'locked' },
    },
    devicePowered: false,
    badgeObtained: false,
  },

  showHint: false,
  showIntro: true,
  soundEnabled: true,
  language: 'en',

  // Actions
  startGame: () => set({ gameStarted: true, showIntro: false }),
  completeGame: () => set({ gameComplete: true }),

  setCurrentRoom: (room) => set({ currentRoom: room }),
  completeRoom: (room) => set((state) => ({
    roomsCompleted: state.roomsCompleted.map((v, i) => i === room ? true : v),
  })),
  setTransitioning: (value) => set({ isTransitioning: value }),

  enterExamineMode: (objectId) => set({ examineMode: true, examinedObject: objectId }),
  exitExamineMode: () => set({ examineMode: false, examinedObject: null }),

  addToInventory: (item) => set((state) => ({
    inventory: [...state.inventory, item],
  })),
  removeFromInventory: (itemId) => set((state) => ({
    inventory: state.inventory.filter((i) => i.id !== itemId),
    selectedItem: state.selectedItem === itemId ? null : state.selectedItem,
  })),
  selectInventoryItem: (itemId) => set({ selectedItem: itemId }),

  addKnowledge: (id) => set((state) => {
    const item = state.knowledge.find((k) => k.id === id);
    return {
      knowledge: state.knowledge.map((k) => k.id === id ? { ...k, found: true } : k),
      sidebarOpen: true,
      selectedKnowledge: item ? { ...item, found: true } : null,
    };
  }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSelectedKnowledge: (item) => set({ selectedKnowledge: item }),

  // Room 1 actions
  setDialPosition: (dialIndex, position) => set((state) => ({
    room1State: {
      ...state.room1State,
      dialPositions: state.room1State.dialPositions.map((v, i) =>
        i === dialIndex ? position : v
      ),
    },
  })),
  findManifesto: () => {
    const state = get();
    state.addKnowledge('manifesto');
    set((state) => ({
      room1State: { ...state.room1State, manifestoFound: true },
    }));
  },
  openBox: () => {
    const state = get();
    state.addKnowledge('objective');
    state.addKnowledge('subjective');
    set((state) => ({
      room1State: { ...state.room1State, boxOpened: true },
    }));
  },
  obtainRoom1Key: () => {
    set((state) => ({
      room1State: { ...state.room1State, keyObtained: true },
    }));
    get().addToInventory({
      id: 'room1-key',
      name: 'Brass Key',
      nameVi: 'Chìa khóa đồng',
      description: 'An ornate brass key from the puzzle box',
      icon: 'key',
    });
    get().completeRoom(0);
  },

  // Room 2 actions
  collectGear: (gearId) => set((state) => ({
    room2State: {
      ...state.room2State,
      gearsCollected: [...state.room2State.gearsCollected, gearId],
    },
  })),
  placeGear: (slotId, gearId) => set((state) => ({
    room2State: {
      ...state.room2State,
      gearsPlaced: { ...state.room2State.gearsPlaced, [slotId]: gearId },
      gearsCollected: state.room2State.gearsCollected.filter((g) => g !== gearId),
    },
  })),
  removeGear: (slotId) => set((state) => {
    const gearId = state.room2State.gearsPlaced[slotId];
    if (!gearId) return state;
    return {
      room2State: {
        ...state.room2State,
        gearsPlaced: { ...state.room2State.gearsPlaced, [slotId]: null },
        gearsCollected: [...state.room2State.gearsCollected, gearId],
      },
    };
  }),
  activateMachine: () => {
    const state = get();
    state.addKnowledge('transition');
    state.addKnowledge('vietnam');
    set((state) => ({
      room2State: { ...state.room2State, machineActivated: true },
    }));
    get().addToInventory({
      id: 'machine-component',
      name: 'Clockwork Core',
      nameVi: 'Lõi cơ khí',
      description: 'A glowing component from the orrery',
      icon: 'cog',
    });
    get().completeRoom(1);
  },

  // Room 3 actions
  unlockCore: (coreId) => set((state) => ({
    room3State: {
      ...state.room3State,
      cores: {
        ...state.room3State.cores,
        [coreId]: { status: 'unlocked' },
      },
    },
  })),
  assembleCore: (coreId) => {
    set((state) => ({
      room3State: {
        ...state.room3State,
        cores: {
          ...state.room3State.cores,
          [coreId]: { status: 'assembled' },
        },
      },
    }));
    // Check if all cores are assembled, then auto-power device
    const state = get();
    const allAssembled = Object.values(state.room3State.cores).every(
      (core) => core.status === 'assembled'
    );
    if (allAssembled && !state.room3State.devicePowered) {
      state.addKnowledge('fpt');
      set((s) => ({
        room3State: { ...s.room3State, devicePowered: true },
      }));
    }
  },
  obtainBadge: () => {
    set((state) => ({
      room3State: { ...state.room3State, badgeObtained: true },
    }));
    get().completeRoom(2);
    get().completeGame();
  },

  // UI actions
  toggleHint: () => set((state) => ({ showHint: !state.showHint })),
  toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
  setLanguage: (lang) => set({ language: lang }),
  resetRoom: (room) => {
    if (room === 0) {
      set({
        room1State: {
          dialPositions: [0, 0, 0, 0],
          manifestoFound: false,
          boxOpened: false,
          keyObtained: false,
        },
      });
    } else if (room === 1) {
      set({
        room2State: {
          gearsPlaced: { economy: null, politics: null, social: null, culture: null },
          gearsCollected: [],
          machineActivated: false,
        },
      });
    } else if (room === 2) {
      set({
        room3State: {
          cores: {
            innovation: { status: 'locked' },
            digital: { status: 'locked' },
            justice: { status: 'locked' },
          },
          devicePowered: false,
          badgeObtained: false,
        },
      });
    }
  },
  returnToIntro: () => set({ showIntro: true, gameStarted: false }),
}));
