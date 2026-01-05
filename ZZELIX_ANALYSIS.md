# Zzelix Projesi - Ultra Detaylı Teknik Analiz ve Geliştirme Raporu

Bu döküman, Zzelix uygulamasının mevcut kod tabanının kapsamlı bir analizini ve Fresh Woman tarzı interaktif bir hikaye platformu (Netflix benzeri) olma hedefine ulaşması için gereken geliştirmeleri, eksiklikleri ve önerileri içermektedir.

## 1. Proje Genel Bakış ve Mimari

**Tech Stack:**
*   **Framework:** Next.js 16.1.1 (App Router)
*   **Dil:** TypeScript
*   **Styling:** Tailwind CSS v4
*   **State Management:** Zustand (Local Storage Persistence ile)
*   **UI/Animations:** Framer Motion, Lucide React

**Mevcut Durum:**
Proje şu anda bir **MVP (Minimum Viable Product) prototipi** aşamasındadır. Arayüz ve temel kullanıcı deneyimi (UX) başarılı bir şekilde kurgulanmış olsa da, veriler ve iş mantığı tamamen istemci tarafında (Client-Side) tutulmakta ve "Mock Data" (sahte veri) ile çalışmaktadır. Gerçek bir "streaming" veya "platform" deneyimi için kritik altyapı bileşenleri eksiktir.

---

## 2. Eksik Kritik Özellikler (Critical Missing Features)

Uygulamanın canlıya alınabilmesi ve hedeflenen kaliteye ulaşabilmesi için aşağıdaki özelliklerin geliştirilmesi şarttır:

### 2.1. Backend ve Veritabanı Entegrasyonu
*   **Mevcut:** Tüm veriler `mockGames.ts` içinde statik veya `localStorage` içinde tarayıcı bazlı tutuluyor.
*   **Gereksinim:**
    *   **Veritabanı:** PostgreSQL veya MongoDB gibi bir veritabanı kurulmalı. (Kullanıcılar, Hikayeler, Bölümler, Sahneler, İlerlemeler, Kayıt Dosyaları).
    *   **API:** Next.js API Routes veya ayrı bir Backend servisi (Node.js/NestJS/Python) ile CRUD işlemleri yapılmalı.
    *   **Senkronizasyon:** Kullanıcının telefonda başladığı oyuna bilgisayarda devam edebilmesi için "Cloud Save" özelliği şart.

### 2.2. Kimlik Doğrulama (Authentication & Authorization)
*   **Mevcut:** Hiçbir kullanıcı girişi sistemi yok.
*   **Gereksinim:**
    *   NextAuth.js (Auth.js) veya Clerk/Supabase Auth entegrasyonu.
    *   Kullanıcı rolleri: `User` (Oyuncu), `Creator` (Yazar), `Admin`.
    *   Creator Panel'e erişim sadece yetkili kullanıcılar için kısıtlanmalı.

### 2.3. Medya Yönetimi (Asset Management)
*   **Mevcut:** Resimler ve sesler için statik placeholder URL'ler kullanılıyor. Dosya yükleme özelliği yok.
*   **Gereksinim:**
    *   **File Upload:** Creator Panel'de yazarların kendi arka planlarını (Background), karakter portrelerini ve ses dosyalarını yükleyebileceği bir arayüz.
    *   **Storage:** AWS S3, Cloudinary veya Firebase Storage entegrasyonu.
    *   **Optimizasyon:** Yüklenen görsellerin web için optimize edilmesi (WebP formatı, farklı çözünürlükler).

### 2.4. Oyun Motoru Mantığı (Game Engine Logic) - İyileştirme
*   **Mevcut:** `creatorStore` ve `gameStore` temel gezinmeyi sağlıyor ancak karmaşık oyun mantığı (Variable Tracking) eksik gibi görünüyor.
*   **Gereksinim:**
    *   **Değişken Sistemi (Variables):** Fresh Woman tarzı oyunlarda seçimler karakterle olan ilişkiyi etkiler (Örn: `lovePoints`, `trustLevel`). Mevcut `Choice` yapısı sadece sahne atlatıyor gibi görünüyor. Seçimlerin değişkenleri artırıp azalttığı bir mantık eklenmeli.
    *   **Koşullu Geçişler (Conditionals):** "Eğer `lovePoints > 10` ise bu sahneye git, değilse diğerine git" gibi mantıksal düğümler (Logic Nodes) eklenmeli.

---

## 3. Modül Bazlı Analiz ve Geliştirme Önerileri

### 3.1. Creator Panel (Yazar Paneli)
Bu bölüm uygulamanın en güçlü taraflarından biri olarak görünüyor, ancak profesyonel kullanım için geliştirmelere ihtiyacı var.

*   **BlueprintCanvas (Görsel Editör):**
    *   **Performans:** Çok büyük hikayelerde (yüzlerce düğüm) özel `BlueprintCanvas` yavaşlayabilir. `React Flow` gibi optimize edilmiş kütüphanelere geçiş düşünülebilir veya mevcut yapı `canvas` API kullanılarak optimize edilmeli.
    *   **Undo/Redo:** Hatalı işlem yapıldığında geri alma özelliği eklenmeli (`zundo` kütüphanesi zustand ile uyumlu çalışır).
    *   **Auto-Layout:** Düğümleri otomatik düzenleyen bir algoritma eklenmeli.
    *   **Medya Önizleme:** Düğümlere tıklandığında atanan arka plan ve müziğin editör içinde önizlenmesi sağlanmalı.

*   **Story Yapısı:**
    *   Mevcut yapı: `Story -> Chapter -> Scene`.
    *   Öneri: `Scene` içine `Dialogue` dizisi eklenmeli. Şu an her sahne tek bir diyalog gibi duruyor. Genelde bir arka plan üzerinde birden fazla diyalog döner. "Scene" kavramı "Arka plan değişikliği" olmalı, içindeki metinler "Line" veya "Dialogue" olmalı.

### 3.2. Oyun Arayüzü (Play Interface)
*   **Visual Novel Standartları:**
    *   **Skip/Auto:** Okunmuş metinleri hızlı geçme (Skip) ve otomatik ilerleme (Auto) butonları eklenmeli.
    *   **Log (Backlog):** Geçmiş diyalogları okuma özelliği.
    *   **UI Gizleme:** Sadece görseli görmek için arayüzü gizleme tuşu.
*   **Ses Sistemi:**
    *   Müzik (BGM) ve Ses Efektleri (SFX) için ayrı ses kanalları ve ses ayarları menüsü eklenmeli.
    *   Sahne geçişlerinde seslerin "fade-out/fade-in" yapması sağlanmalı.

### 3.3. Ana Sayfa (Netflix Style Home)
*   **Kişiselleştirme:**
    *   "Sizin için önerilenler" algoritması, kullanıcının oynadığı oyun türlerine göre geliştirilmeli.
    *   "Kaldığınız yerden devam edin" kısmı backend verisiyle senkronize çalışmalı.

---

## 4. Kod Kalitesi ve Altyapı İyileştirmeleri

### 4.1. TypeScript Tipleri
*   `CreatorStory` ve `Game` tipleri arasında veri dönüşümü (`mapCreatorStoryToGame`) manuel yapılıyor. Bu iki tipin ortak bir "Core Schema"dan türetilmesi bakım maliyetini düşürür.
*   `any` kullanımı engellenmeli ve tüm prop'lar sıkı bir şekilde tiplenmeli.

### 4.2. Performans
*   **Lazy Loading:** Hikaye görselleri ve ses dosyaları sadece ihtiyaç duyulduğunda yüklenmeli (Preloading stratejisi ile bir sonraki sahne önceden yüklenmeli).
*   **Code Splitting:** Creator panel gibi ağır modüller `dynamic import` ile yüklenmeli.

### 4.3. Test
*   Şu an projede test kodu görünmüyor.
    *   **Unit Test:** Yardımcı fonksiyonlar (`utils`) ve Store mantığı için Vitest/Jest.
    *   **E2E Test:** Kritik akışlar (Oyun oluşturma, Oyunu oynama) için Playwright/Cypress.

---

## 5. Yol Haritası (Roadmap) Önerisi

1.  **Faz 1: Backend Altyapısı (1-2 Hafta)**
    *   Veritabanı şemasının tasarlanması.
    *   Auth entegrasyonu.
    *   Temel API uçlarının yazılması.

2.  **Faz 2: Oyun Motoru Güncellemesi (2 Hafta)**
    *   Değişken (Variable) ve Koşul (Conditional) sisteminin eklenmesi.
    *   `Scene` yapısının `Scene -> Dialogues` şeklinde refactor edilmesi.

3.  **Faz 3: Asset Yönetimi (1 Hafta)**
    *   Dosya yükleme (Upload) servisinin yazılması.
    *   Creator panel'e medya kütüphanesi entegrasyonu.

4.  **Faz 4: Polish & UX (1 Hafta)**
    *   Oyun içi ses kontrolleri, skip/auto özellikleri.
    *   Animasyonların iyileştirilmesi.

Bu döküman, Zzelix'i basit bir prototipten ticari bir ürüne dönüştürmek için gereken adımları özetlemektedir.
