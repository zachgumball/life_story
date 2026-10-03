export type StoryEntry = {
  slug: string;
  title: string;
  date: string;
  location: string;
  category: "Travel" | "Reflection" | "Journey";
  blurb: string;
  description: string;
  image: string;
  highlights: string[];
  gallery: string[];
  checkpointSummaries?: string[];
  translations?: {
    en?: {
      title?: string;
      date?: string;
      blurb?: string;
      description?: string;
      highlights?: string[];
    };
  };
};

export const storyEntries: StoryEntry[] = [
  {
    slug: "sunrise-di-bali",
    title: "Sunrise di Bali",
    date: "12 Agustus 2026",
    location: "Uluwatu, Bali",
    category: "Travel",
    blurb:
      "Perjalanan ini mengingatkan saya bahwa momen paling tenang bisa menjadi bagian paling terang dalam hidup.",
    description:
      "Pagi itu saya tiba di Uluwatu saat matahari belum muncul. Udara dingin, langit masih kelabu. Saya duduk di tepi tebing, menunggu cahaya pertama menyentuh laut. Dalam hening, saya sadar bahwa hal-hal besar dalam hidup tak selalu datang dengan gegap gempita. Kadang, semuanya hadir perlahan. Saat matahari terbit, beban yang saya bawa beberapa pekan terakhir terasa sedikit lebih ringan. Saya tidak sedang mencari jawaban. Saya hanya ingin hadir sepenuhnya, dan itu sudah cukup.",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    highlights: [
      "Menunggu cahaya pertama muncul di cakrawala",
      "Menulis rasa syukur ditemani angin laut",
      "Menemukan ketenangan dalam hening",
      "Mengabadikan momen yang terasa seperti catatan hati",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    ],
    translations: {
      en: {
        title: "Sunrise in Bali",
        date: "August 12, 2026",
        blurb: "A quiet morning in Bali reminded me that our brightest moments can arrive softly.",
        description: "I reached Uluwatu before sunrise. The air was cool and the sky still grey as I sat near the cliff, waiting for the first light to touch the sea. In the quiet, I realized that the important things in life do not always arrive with fanfare. Sometimes they come gently, without hurry. As the sun rose, the weight I had carried for weeks began to feel a little lighter. I was not looking for an answer. I was simply there, fully present, and that was enough.",
        highlights: ["Waiting for the first light on the horizon", "Writing down what I was grateful for in the sea breeze", "Finding an unexpected calm in the stillness", "Taking a photograph that felt more like a note to myself"],
      },
    },
  },
  {
    slug: "jalan-ke-bandung",
    title: "Jalan ke Bandung",
    date: "03 September 2026",
    location: "Bandung, Indonesia",
    category: "Journey",
    blurb:
      "Bandung mengingatkan saya bahwa hidup terasa lebih kaya saat saya bersedia memperhatikan hal-hal kecil.",
    description:
      "Saya berangkat ke Bandung dengan rasa ingin tahu sederhana—cukup untuk membuat saya terbuka pada hal baru. Kota itu terasa hidup tanpa tergesa: jalan-jalan berwarna, kafe yang hangat, dan orang-orang dengan cerita mereka sendiri. Saya berjalan tanpa banyak rencana, berhenti di tempat yang menarik perhatian, dan sesekali mendengarkan suara hati sendiri. Perjalanan itu mengingatkan saya bahwa arah hidup tak selalu ditentukan oleh keputusan besar. Sering kali, arah itu terbentuk dari langkah kecil yang kita ambil dengan sadar, meski belum tahu akan berakhir di mana.",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
    highlights: [
      "Menyusuri jalan kota sambil mencatat ide-ide yang tiba-tiba hadir",
      "Datang ke kafe yang menjadi tempat paling tenang dalam hari itu",
      "Membicarakan masa depan dengan lebih jujur daripada biasanya",
      "Menemukan bahwa lingkungan bisa mengubah cara kita melihat diri sendiri",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80",
    ],
    translations: {
      en: {
        title: "A Walk Through Bandung",
        date: "September 3, 2026",
        blurb: "Bandung reminded me that life feels richer when I make room for the small details.",
        description: "I came to Bandung with a simple curiosity, enough to make me open to something new. The city felt lively without rushing: colorful streets, welcoming cafés, and people with stories of their own. I wandered without much of a plan, stopping wherever something caught my eye and taking a moment to listen to myself. The trip reminded me that our direction in life is not always set by one big decision. More often, it takes shape through small, deliberate steps, even when we do not yet know where they will lead.",
        highlights: ["Walking the city streets and noting ideas as they came", "Finding a quiet corner in a café", "Talking about the future more honestly than usual", "Seeing how a new place can shift the way we see ourselves"],
      },
    },
  },
  {
    slug: "malam-pengakuan",
    title: "Malam Pengakuan",
    date: "19 Mei 2026",
    location: "Jakarta, Indonesia",
    category: "Reflection",
    blurb:
      "Malam itu saya sadar: hidup yang berarti bukan cuma soal terlihat berhasil, tetapi juga tentang merasa utuh dan jujur pada diri sendiri.",
    description:
      "Saya duduk sendiri di kamar dengan lampu redup, lalu mulai menulis tanpa menyaring kata. Saya menuliskan ketakutan yang selama ini saya pendam, harapan yang takut tak akan terwujud, dan kebutuhan yang tertutup oleh kesibukan. Saat kata-kata mulai mengalir, ada bagian dari diri saya yang akhirnya mendapat ruang untuk bicara. Saya tidak mencari jawaban sempurna malam itu. Saya hanya ingin memahami apa yang saya rasakan dan inginkan. Dari sana saya belajar: menjadi diri sendiri bukan berarti harus langsung kuat. Kadang, langkah pertamanya adalah berani jujur.",
    image:
      "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=1200&q=80",
    highlights: [
      "Menulis sejujurnya agar lebih memahami diri sendiri",
      "Mengakui ketakutan yang selama ini saya pendam",
      "Menyadari bahwa perubahan berawal dari menerima diri, bukan memaksanya",
      "Menemukan ketenangan dengan memberi waktu untuk merenung",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80",
    ],
    translations: {
      en: {
        title: "The Night I Was Honest With Myself",
        date: "May 19, 2026",
        blurb: "That night, I realized a meaningful life is not just one that looks successful, but one that feels honest and whole.",
        description: "Alone in my dimly lit room, I began writing without editing myself. I put down the fears I had kept hidden, the hopes I worried might never come true, and the needs I had buried beneath a busy life. As the words came, a part of me finally had room to speak. I was not looking for a perfect answer. I wanted to understand what I felt and what I truly wanted. I began to see that becoming myself did not mean becoming stronger all at once. Sometimes the first step is simply being honest.",
        highlights: ["Writing honestly to see myself more clearly", "Naming the fears I had kept to myself", "Learning that change begins with acceptance, not self-pressure", "Finding calm by giving reflection the time it needed"],
      },
    },
  },
];

export const featuredPlans = [
  {
    title: "Sunrise trip to Bali",
    titleId: "Menyambut matahari pagi di Bali",
    date: "12 August 2026",
    dateId: "12 Agustus 2026",
    location: "Uluwatu",
    description: "A planned trip to remember, reflect, and photograph the smallest moments before the day begins.",
    descriptionId: "Menikmati pagi, meluangkan waktu untuk merenung, dan mengabadikan suasana sebelum hari dimulai.",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Creative weekend in Bandung",
    titleId: "Akhir pekan kreatif di Bandung",
    date: "03 September 2026",
    dateId: "3 September 2026",
    location: "Bandung",
    description: "Exploring creative spaces and finding inspiration in the details that make a city alive.",
    descriptionId: "Mengunjungi ruang-ruang kreatif dan mencari inspirasi dari hal kecil yang membuat kota terasa hidup.",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Mountain reflection retreat",
    titleId: "Mencari jeda di pegunungan",
    date: "27 October 2026",
    dateId: "27 Oktober 2026",
    location: "Puncak",
    description: "A quiet reset to slow down, reconnect with myself, and decide what truly matters next.",
    descriptionId: "Mengambil jeda, kembali mendengarkan diri sendiri, dan menentukan hal yang benar-benar penting selanjutnya.",
    image:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80",
  },
];

export const galleryImages = [
  "https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80",
];
