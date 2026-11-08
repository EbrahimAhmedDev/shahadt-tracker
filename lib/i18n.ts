export type Language = 'ar' | 'en';

export type TranslationRecord = Record<
  | 'appTitle'
  | 'appSubTitle'
  | 'tagline'
  | 'searchPlaceholder'
  | 'searchButton'
  | 'searching'
  | 'addMedia'
  | 'addManual'
  | 'all'
  | 'watching'
  | 'completed'
  | 'planToWatch'
  | 'dropped'
  | 'movie'
  | 'series'
  | 'source'
  | 'sourceTopCinema'
  | 'sourceAhwak'
  | 'sourceManual'
  | 'episode'
  | 'season'
  | 'currentEpisode'
  | 'currentSeason'
  | 'totalEpisodes'
  | 'incrementEpisode'
  | 'markCompleted'
  | 'edit'
  | 'delete'
  | 'save'
  | 'cancel'
  | 'rating'
  | 'notes'
  | 'notesPlaceholder'
  | 'story'
  | 'year'
  | 'stats'
  | 'moviesCount'
  | 'seriesCount'
  | 'episodesWatched'
  | 'avgRating'
  | 'emptyList'
  | 'emptyListSub'
  | 'noResults'
  | 'searchModalTitle'
  | 'searchResults'
  | 'addToTracker'
  | 'selectStatus'
  | 'customPoster'
  | 'customTitle'
  | 'guestMode'
  | 'guestNotice'
  | 'confirmDelete'
  | 'congratsTitle'
  | 'congratsDesc'
  | 'viewDetails'
  | 'syncStatusCloud'
  | 'syncStatusLocal'
  | 'syncStatusError'
  | 'syncStatusSyncing',
  string
>;

export const translations: Record<Language, TranslationRecord> = {
  ar: {
    appTitle: 'شاهدت',
    appSubTitle: 'Shahadt',
    tagline: 'منصتك السينمائية الفاخرة لتتبع أفلامك ومسلسلاتك المفضلة',
    searchPlaceholder: 'ابحث باسم الفيلم أو المسلسل (مثال: باتمان، الحشاشين، Game of Thrones)...',
    searchButton: 'بحث فوري',
    searching: 'جاري البحث في توب سينما وأهواك...',
    addMedia: 'إضافة عمل',
    addManual: 'إضافة يدوية',
    all: 'الكل',
    watching: 'أشاهد حالياً',
    completed: 'تمت المشاهدة',
    planToWatch: 'في الخطة',
    dropped: 'متوقف',
    movie: 'فيلم',
    series: 'مسلسل',
    source: 'المصدر',
    sourceTopCinema: 'توب سينما',
    sourceAhwak: 'أهواك تي في',
    sourceManual: 'إضافة يدوية',
    episode: 'حلقة',
    season: 'موسم',
    currentEpisode: 'الحلقة الحالية',
    currentSeason: 'الموسم الحالي',
    totalEpisodes: 'إجمالي الحلقات',
    incrementEpisode: '+1 حلقة',
    markCompleted: 'انتهيت منه 🎉',
    edit: 'تعديل',
    delete: 'حذف',
    save: 'حفظ التعديلات',
    cancel: 'إلغاء',
    rating: 'تقييمك',
    notes: 'ملاحظات وانطباعاتك',
    notesPlaceholder: 'اكتب رأيك الشخصي، مشهدك المفضل، أو أي تفاصيل ترغب بتذكرها...',
    story: 'القصة والأحداث',
    year: 'سنة الإنتاج',
    stats: 'لوحة الإحصائيات',
    moviesCount: 'أفلام مكتملة',
    seriesCount: 'مسلسلات تتابعها/أتممتها',
    episodesWatched: 'حلقات شاهدتها',
    avgRating: 'متوسط تقييمك',
    emptyList: 'لا توجد أعمال في هذه القائمة حالياً',
    emptyListSub: 'انقر على "إضافة عمل" بالبحث في توب سينما وأهواك تي في أو الإضافة اليدوية',
    noResults: 'لم يتم العثور على نتائج في توب سينما أو أهواك. يمكنك إضافته يدوياً بسهولة!',
    searchModalTitle: 'ابحث عن فيلم أو مسلسل',
    searchResults: 'نتائج البحث',
    addToTracker: 'إضافة للمتابعة',
    selectStatus: 'حالة المشاهدة',
    customPoster: 'رابط البوستر (اختياري)',
    customTitle: 'عنوان العمل',
    guestMode: 'وضع التخزين المحلي (جاهز)',
    guestNotice: 'بياناتك محفوظة محلياً على جهازك، ويمكن ربطها بحساب Supabase السحابي.',
    confirmDelete: 'هل أنت متأكد من حذف هذا العمل من قائمتك؟',
    congratsTitle: 'مبروك الانتهاء!',
    congratsDesc: 'أحسنت! أتممت مشاهدة العمل وتم نقله إلى قائمة "تمت المشاهدة".',
    viewDetails: 'عرض التفاصيل',
    syncStatusCloud: 'المزامنة السحابية',
    syncStatusLocal: 'وضع محلي',
    syncStatusError: 'مزامنة غير متاحة',
    syncStatusSyncing: 'جاري المزامنة…',
  },
  en: {
    appTitle: 'Shahadt',
    appSubTitle: 'شاهدت',
    tagline: 'Your luxury cinematic platform to track your movies & TV shows',
    searchPlaceholder: 'Search movie or TV series (e.g. Batman, Breaking Bad)...',
    searchButton: 'Search',
    searching: 'Searching Top Cinema & Ahwak TV...',
    addMedia: 'Add Media',
    addManual: 'Manual Entry',
    all: 'All',
    watching: 'Watching',
    completed: 'Completed',
    planToWatch: 'Plan to Watch',
    dropped: 'Dropped',
    movie: 'Movie',
    series: 'TV Series',
    source: 'Source',
    sourceTopCinema: 'Top Cinema',
    sourceAhwak: 'Ahwak TV',
    sourceManual: 'Custom Entry',
    episode: 'Episode',
    season: 'Season',
    currentEpisode: 'Current Episode',
    currentSeason: 'Current Season',
    totalEpisodes: 'Total Episodes',
    incrementEpisode: '+1 Ep',
    markCompleted: 'Completed 🎉',
    edit: 'Edit',
    delete: 'Delete',
    save: 'Save Changes',
    cancel: 'Cancel',
    rating: 'Your Rating',
    notes: 'Notes & Thoughts',
    notesPlaceholder: 'Write your review, favorite quotes, or thoughts...',
    story: 'Overview',
    year: 'Year',
    stats: 'Statistics',
    moviesCount: 'Movies Watched',
    seriesCount: 'Series Tracked',
    episodesWatched: 'Episodes Watched',
    avgRating: 'Average Rating',
    emptyList: 'No items in this list yet',
    emptyListSub: 'Click "Add Media" to search Top Cinema & Ahwak TV or add manually',
    noResults: 'No results found on Top Cinema or Ahwak TV. You can add it manually!',
    searchModalTitle: 'Search Movie or Series',
    searchResults: 'Search Results',
    addToTracker: 'Add to Watchlist',
    selectStatus: 'Watch Status',
    customPoster: 'Poster URL (Optional)',
    customTitle: 'Media Title',
    guestMode: 'Local Storage Mode (Active)',
    guestNotice: 'Your watch history is saved locally and can be synced with Supabase.',
    confirmDelete: 'Are you sure you want to remove this item from your watchlist?',
    congratsTitle: 'Congratulations!',
    congratsDesc: 'You finished this title! Moved to your Completed list.',
    viewDetails: 'View details',
    syncStatusCloud: 'Cloud synced',
    syncStatusLocal: 'Local mode',
    syncStatusError: 'Sync unavailable',
    syncStatusSyncing: 'Syncing…',
  },
} as const;
