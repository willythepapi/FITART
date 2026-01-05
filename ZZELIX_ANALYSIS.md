# Zzelix Projesi - Ultra Detaylı Teknik Analiz ve Geliştirme Raporu

Bu döküman, **Zzelix** uygulamasının mevcut kod tabanının (source code) derinlemesine analizini ve Fresh Woman tarzı "next-gen" interaktif bir hikaye platformu (Netflix benzeri) olma hedefine ulaşması için gereken teknik yol haritasını, eksiklikleri ve çözüm önerilerini içerir.

---

## 1. Yönetici Özeti (Executive Summary)

**Zzelix**, modern web teknolojileriyle (Next.js, React, Zustand) geliştirilmiş, Netflix benzeri bir arayüze sahip görsel roman (Visual Novel) platformudur. Mevcut haliyle proje, kullanıcı arayüzü (UI) ve içerik üreticisi (Creator) araçları açısından güçlü bir **MVP (Minimum Viable Product)** seviyesindedir. Ancak, ölçeklenebilir bir ticari ürün olabilmesi için **Backend (Sunucu)**, **Veri Kalıcılığı (Database)** ve **Gelişmiş Oyun Motoru (Game Engine)** katmanlarında ciddi geliştirmelere ihtiyaç duymaktadır.

---

## 2. Mevcut Mimari ve Teknoloji Analizi

### 2.1. Tech Stack (Teknoloji Yığını)
*   **Frontend Framework:** Next.js 14.1.0 (App Router mimarisi)
*   **Dil:** TypeScript 5.x (Tip güvenliği için kritik)
*   **Styling:** Tailwind CSS 3.x (Hızlı ve modern UI geliştirme)
*   **State Management:** Zustand (İstemci tarafı durum yönetimi)
*   **Animasyonlar:** Framer Motion (Akıcı geçişler)
*   **İkon Seti:** Lucide React

### 2.2. Proje Yapısı
*   `src/app/creatorpanel`: Yazarların hikaye oluşturduğu gelişmiş "Düğüm Editörü" (Node-based editor).
*   `src/app/game` & `src/app/play`: Son kullanıcıların oyunları oynadığı arayüzler.
*   `src/store`: Uygulama durumunu yöneten Zustand modülleri (`creatorStore`, `gameStore`).
*   `src/types`: Veri modelleri.

---

## 3. Kritik Eksiklikler ve Geliştirme Alanları (Gap Analysis)

Aşağıdaki maddeler, uygulamanın "Canlı" (Production) ortama geçebilmesi için tamamlanması gereken **zorunlu** geliştirmelerdir.

### 3.1. Veri Mimarisi ve Entegrasyon (Backend & Database)
*   **Mevcut Durum:** Veriler `mockGames.ts` içinde statik olarak veya `localStorage` içinde tarayıcı hafızasında tutulmaktadır.
*   **Sorun:** Kullanıcılar cihaz değiştirdiğinde ilerlemeleri kaybolur. Yeni oyunlar kod değişikliği olmadan eklenemez.
*   **Çözüm:**
    *   **Veritabanı:** PostgreSQL (ilişkisel veriler için) ve MongoDB (JSON tabanlı hikaye içerikleri için) hibrit yapısı önerilir.
    *   **API Katmanı:** Next.js API Routes veya ayrı bir Backend (Node.js/NestJS) ile REST/GraphQL API yazılmalı.
    *   **Senkronizasyon (Cloud Save):** `UserProgress` verisinin sunucuya anlık (real-time) yedeklenmesi.

### 3.2. Oyun Motoru ve Mantık (Advanced Game Engine)
Fresh Woman tarzı oyunların temelindeki "Değişken Takibi" (Variable Tracking) şu an eksiktir.
*   **Eksik Özellikler:**
    *   **Global/Local Değişkenler:** Karakter ilişkilerini (`lovePoints`, `trustLevel`) veya envanter öğelerini (`hasKey`) tutan bir sistem.
    *   **Koşullu Mantık (Conditionals):** "Eğer `lovePoints > 50` ise Sahne A'ya git, değilse Sahne B'ye git" mantığını kuracak editör düğümleri.
    *   **Karmaşık Sahne Yapısı:** Şu anki `SceneBlueprint` yapısı tek bir arka plan ve tek bir diyalog satırı üzerine kurulu. Gerçekte bir sahnede, arka plan değişmeden karakterler defalarca konuşabilir (`Dialogue Chain`).

### 3.3. Çoklu Dil Desteği (Localization)
*   **Tespit:** `src/types/creatorTypes.ts` içinde `LocalizedString` ({ tr: '...', en: '...' }) yapısı var ancak `src/types/index.ts` içindeki `Game` yapısı sadece `string` kabul ediyor.
*   **Risk:** Oyunlar oluşturulurken çok dilli girilse bile, oynatıcı (Player) kısmında bu veriyi yönetecek yapı eksik. Dil seçimine göre içeriğin dinamik değişmesi gerekiyor.

### 3.4. Medya ve Asset Yönetimi
*   **Mevcut Durum:** Görseller `/images/placeholders` gibi statik yollardan çekiliyor.
*   **Gereksinim:**
    *   **Creator Upload:** Yazarların kendi görsellerini ve ses dosyalarını yükleyebileceği bir arayüz.
    *   **CDN (İçerik Dağıtım Ağı):** Dosyaların hızlı yüklenmesi için AWS S3 + CloudFront veya Cloudinary entegrasyonu.
    *   **Ses Katmanları:** Müzik (BGM), Ses Efekti (SFX) ve Seslendirme (Voiceover) kanallarının ayrı ayrı kontrol edilmesi (Volume Mixer).

---

## 4. Modül Bazlı Detaylı İyileştirme Önerileri

### 4.1. Creator Panel (Yazar Stüdyosu)
Burası uygulamanın kalbidir. `BlueprintCanvas` bileşeni özelleştirilmelidir.
*   **Performans:** Yüzlerce sahne içeren hikayelerde mevcut DOM tabanlı render yöntemi tarayıcıyı kasabilir. **React Flow** kütüphanesine geçiş veya HTML5 Canvas API ile optimizasyon şart.
*   **Kullanılabilirlik (UX):**
    *   **Mini-Map:** Büyük haritalarda gezinmek için küçük harita (Mevcut kodda var, geliştirilmeli).
    *   **Undo/Redo:** Hatalı silinen sahneleri geri getirme.
    *   **Asset Picker:** Sahne arka planını seçerken dosya yükleme modalı açılması.

### 4.2. Game Player (Oynatıcı)
*   **Auto-Play & Skip:** Görsel romanların olmazsa olmazı "Otomatik İlerleme" ve "Okunmuşu Geç" butonları eklenmeli.
*   **Backlog (Geçmiş):** Kaçırılan diyalogları okumak için bir geçmiş penceresi.
*   **UI Hiding:** Görselin tamamını görmek için arayüzü gizleme (Hide UI) tuşu.

### 4.3. Ana Sayfa (Discovery)
*   **Algoritma:** "Sizin İçin Önerilenler" kısmı kullanıcının önceki tercihlerine göre (Romantik sevene Romantik önerisi) dinamikleşmeli.
*   **Fragman Oynatma:** Oyun kartının üzerine gelince (Hover) kısa videonun oynaması (Netflix style).

---

## 5. Veri Modeli Önerisi (Data Schema Recommendation)

Mevcut `dataMapper.ts` incelendiğinde `CreatorStory` ve `Game` tipleri arasında kopukluk olduğu görülüyor. İdeal yapı şöyle olmalı:

```typescript
// Önerilen Gelişmiş Sahne Yapısı
interface AdvancedScene {
  id: string;
  backgroundId: string; // Asset ID
  musicId?: string;     // Asset ID
  script: ScriptLine[]; // Bir sahnede birden fazla konuşma
}

interface ScriptLine {
  characterId: string; // Konuşan kişi
  text: LocalizedString; // Çeviri destekli metin
  voiceoverUrl?: LocalizedString;
  expression: 'happy' | 'sad' | 'angry'; // Karakter yüz ifadesi
  animation?: 'shake' | 'fade-in'; // Metin/Ekran efekti
}
```

---

## 6. Yol Haritası (Implementation Roadmap)

Bu projeyi hayata geçirmek için önerilen 4 fazlı çalışma planı:

**Faz 1: Altyapı ve Veri (2 Hafta)**
*   Veritabanı kurulumu (PostgreSQL + Prisma ORM).
*   Authentication (Giriş) sisteminin entegrasyonu (NextAuth).
*   Temel API'lerin yazılması.

**Faz 2: Creator Panel 2.0 (3 Hafta)**
*   Dosya yükleme (Upload) sistemi.
*   `BlueprintCanvas` performans optimizasyonu.
*   Çoklu dil giriş desteğinin arayüze eklenmesi.

**Faz 3: Gelişmiş Oynatıcı (2 Hafta)**
*   Yeni sahne yapısının (`ScriptLine`) oynatıcıya entegrasyonu.
*   Ses motorunun (Audio Engine) yazılması.
*   Kayıt (Save/Load) sisteminin Cloud'a taşınması.

**Faz 4: Polish & Launch (1 Hafta)**
*   UI/UX cilalamaları, animasyonlar.
*   Mobil uyumluluk testleri.
*   Yük testi ve optimizasyon.

Bu döküman, Zzelix projesinin teknik vizyonunu ve yapılması gerekenleri net bir şekilde ortaya koymaktadır.
