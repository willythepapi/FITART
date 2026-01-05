// Creator Panel Type Definitions

export interface CreatorStory {
    id: string;
    title: string;
    description: string;
    synopsis: string;
    category: 'romance' | 'mystery' | 'sci-fi' | 'fantasy' | 'horror' | 'drama' | 'comedy' | 'action' | 'slice-of-life';
    rating: 'everyone' | 'teen' | 'mature';

    // Minimum 3 poster görseli gerekli
    posters: {
        thumbnail: string;      // Kart için (16:9)
        banner: string;         // Hero için (geniş)
        portrait: string;       // Detay sayfası için (dikey)
    };

    chapters: StoryChapter[];

    status: 'draft' | 'review' | 'scheduled' | 'published';
    publishDate?: Date | null; // Yayın tarihi (Geçmişse yayınlandı, gelecekteyse planlandı)
    tags?: string[];
    createdAt: Date;
    updatedAt: Date;
    creatorId: string;
}

export interface StoryChapter {
    id: string;
    title: string;
    order: number;
    scenes: SceneBlueprint[];
    blueprint?: {
        // BlueprintNodeData is defined in a component file. I should probably move it here or just use any/object for now to save time.
        // Better: Define Blueprint interfaces here.
        nodes: BlueprintNodeData[];
        connections: Connection[];
    };
}

export type Language = 'tr' | 'en' | 'es' | 'de' | 'fr';
export type LocalizedString = { [key in Language]?: string };

export interface BlueprintNodeData {
    id: string;
    type: 'start' | 'scene' | 'choice' | 'end';
    title: string;
    x: number;
    y: number;
    outputs?: string[];
    data?: {
        backgroundImage?: string;
        voiceover?: LocalizedString;
        dialogText?: LocalizedString;
        speaker?: string;
        choices?: { id: string; text: LocalizedString; targetId?: string }[];
    };
}

export interface Connection {
    id: string;
    fromId: string;
    toId: string;
    fromOutput?: number;
}

export interface SceneBlueprint {
    id: string;
    order: number;

    // Görsel - Sahne arka planı
    backgroundImage: string;

    // Ses - Zorunlu seslendirme + arka plan müziği
    audio: {
        voiceover: LocalizedString;       // Seslendirme (zorunlu) - Localized
        backgroundMusic?: string; // Arka plan sesi (sahneye özel gerilim müziği vb.)
        backgroundVolume?: number; // 0-100
    };

    // Diyalog/Metin
    dialog: {
        text: LocalizedString;          // Alt yazı metni - Localized
        speaker?: string;      // Konuşan karakter (opsiyonel, narrator için boş)
        duration?: number;     // Otomatik geçiş süresi (ms)
    };

    // Seçenekler - İnteraktif dallanma (opsiyonel)
    choices?: SceneChoice[];

    // Sonraki sahne (seçenek yoksa)
    nextSceneId?: string;
}

export interface SceneChoice {
    id: string;
    text: LocalizedString;
    nextSceneId: string;
    consequence?: string; // Hikaye dalı takibi için
}

// Media yükleme için
export interface MediaAsset {
    id: string;
    type: 'image' | 'audio';
    url: string;
    filename: string;
    size: number;
    uploadedAt: Date;
}

// Yeni hikaye oluşturma formu
export interface NewStoryForm {
    title: string;
    description: string;
    synopsis: string;
    category: CreatorStory['category'];
    rating: CreatorStory['rating'];
}
