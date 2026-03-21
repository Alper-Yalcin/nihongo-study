import { AppLanguage } from '../data/appPreferences';

export type OverviewStudyAreaId = 'typing' | 'drawing' | 'listening' | 'dictionary';

interface OverviewModalTopic {
  id: string;
  title: string;
  lead: string;
  paragraphs: string[];
  learningPoints: string[];
  demoSrc: string;
  demoAlt: string;
  fallbackTitle: string;
  fallbackPath: string;
}

interface OverviewModalSection {
  badge: string;
  title: string;
  intro: string;
  mediaPosition: 'left' | 'right';
  topics: OverviewModalTopic[];
}

interface OverviewModalCopy {
  close: string;
  topicsLabel: string;
  previewLabel: string;
  learningLabel: string;
  sections: Record<OverviewStudyAreaId, OverviewModalSection>;
}

const trTypingSection: OverviewModalSection = {
  badge: 'Çalışma Modu',
  title: 'Kana Typing Pratiği',
  intro:
    'Typing alanı, kana tanıma hızını aktif üretimle birleştirir. Kullanıcı sadece karakteri görüp hatırlamaz; doğru romajiyi yazar, yanlışlarını fark eder ve kısa tekrar döngüleriyle okuma refleksini güçlendirir.',
  mediaPosition: 'right',
  topics: [
    {
      id: 'typing-standard',
      title: 'Standart Mod',
      lead: 'Karakteri görüp romajiyi yazdığın temel akış, kana okuma alışkanlığını yerleştiren ana çalışma modudur.',
      paragraphs: [
        'Bu bölümde ekranda doğrudan kana karakteri görünür ve kullanıcı o karakterin romaji karşılığını girer. Bu yapı özellikle hiragana ve katakana satırlarını ilk kez oturturken çok etkilidir çünkü göz, ses karşılığı ve romaji biçimi aynı anda tekrar edilir.',
        'Standart mod kısa tekrarlarla hatayı hemen görünür kılar. Kullanıcı bir karakteri tanımakta zorlanıyorsa bunu anında fark eder ve benzer karakterlerle karıştırdığı noktaları daha erken düzeltir.'
      ],
      learningPoints: [
        'Kana -> romaji eşleşmesini hızlandırır',
        'Benzer karakterleri ayırt etmeyi güçlendirir',
        'Temel doğruluk ve hız alışkanlığı kurar'
      ],
      demoSrc: '/gifs/typing-standard.gif',
      demoAlt: 'Standart typing modu demosu',
      fallbackTitle: 'Typing Standard Demo GIF',
      fallbackPath: '/gifs/typing-standard.gif'
    },
    {
      id: 'typing-reverse',
      title: 'Romajiden Kana',
      lead: 'Ters akış, kullanıcıyı görsel üretime zorlar ve pasif tanımadan aktif hatırlamaya geçirir.',
      paragraphs: [
        'Bu modda ekranda romaji gösterilir ve kullanıcı karşılık gelen kana karakterini yazar. Özellikle karakterleri gördüğünde tanıyıp, kendisi üretmekte zorlanan kullanıcılar için çok değerlidir.',
        'Bu akış zihindeki karakter şekillerini daha sağlam sabitler. Çünkü kullanıcı hazır cevabı seçmez; romajiden doğru kana formunu geri çağırmak zorunda kalır.'
      ],
      learningPoints: [
        'Aktif karakter hatırlamayı geliştirir',
        'Kana formunu zihinden üretmeyi öğretir',
        'Yazıma geçiş öncesi güçlü bir ara aşama sunar'
      ],
      demoSrc: '/gifs/typing-reverse.gif',
      demoAlt: 'Romajiden kana typing modu demosu',
      fallbackTitle: 'Typing Reverse Demo GIF',
      fallbackPath: '/gifs/typing-reverse.gif'
    },
    {
      id: 'typing-timed',
      title: 'Zamana Karşı',
      lead: 'Süre baskısı altında yüksek tempolu tekrar yaptıran bu mod, otomatik tanıma hızını ölçmek için kullanılır.',
      paragraphs: [
        'Zamana karşı modunda amaç sadece doğru cevap vermek değil, bunu ritmi bozmadan sürdürebilmektir. Kullanıcı kısa sürede çok sayıda karakter gördüğü için hangi gruplarda takıldığını hemen fark eder.',
        'Bu mod düzenli tekrar sonrası gelişimi karşılaştırmak için de idealdir. Doğruluk, hız ve seri bilgileri birlikte izlendiğinde hangi aşamada akıcılık kazandığın daha net görünür.'
      ],
      learningPoints: [
        'Anlık recall hızını artırır',
        'Streak ve accuracy baskısı altında odaklanmayı güçlendirir',
        'Gelişimi skorlarla takip etmeyi kolaylaştırır'
      ],
      demoSrc: '/gifs/typing-demo.gif',
      demoAlt: 'Zamana karşı typing modu demosu',
      fallbackTitle: 'Typing Timed Demo GIF',
      fallbackPath: '/gifs/typing-demo.gif'
    }
  ]
};

const trDrawingSection: OverviewModalSection = {
  badge: 'Çalışma Modu',
  title: 'Kana Çizim Pratiği',
  intro:
    'Drawing alanı, karakteri sadece tanımayı değil fiziksel olarak üretmeyi hedefler. Bu bölüm el hafızasını, stroke farkındalığını ve karakter formunu uzun vadeli olarak oturtmak için tasarlanmıştır.',
  mediaPosition: 'left',
  topics: [
    {
      id: 'drawing-practice',
      title: 'Pratik Modu',
      lead: 'Şablon ve rehberle çalışan bu mod, kana yazımına güvenli bir başlangıç sunar.',
      paragraphs: [
        'Pratik modunda kullanıcı karakterin rehber formunu görür, stroke düzenini izler ve çizimi kılavuz eşliğinde tamamlar. Bu, özellikle henüz karakter kas hafızası oluşmamışken temel formu oturtmak için önemlidir.',
        'Gösterilen yön okları ve stroke rehberleri, karakteri sadece kopyalamayı değil hangi hareket mantığıyla yazıldığını da öğretir. Böylece kullanıcı daha sonra rehbersiz modlara geçerken daha az zorlanır.'
      ],
      learningPoints: [
        'Stroke düzenini adım adım öğretir',
        'Karakter oranını ve yerleşimini sabitler',
        'Yeni başlayanlar için düşük hata maliyetli alıştırma sağlar'
      ],
      demoSrc: '/gifs/drawing-practice.gif',
      demoAlt: 'Pratik çizim modu demosu',
      fallbackTitle: 'Drawing Practice Demo GIF',
      fallbackPath: '/gifs/drawing-practice.gif'
    },
    {
      id: 'drawing-test',
      title: 'Test Modu',
      lead: 'Rehber desteği azalır; kullanıcı karakteri ne kadar doğru hatırladığını doğrudan test eder.',
      paragraphs: [
        'Test modunda amaç, rehber yardımından çıkarak karakteri daha bağımsız biçimde çizebilmektir. Bu, görsel hafıza ile motor hafızanın birlikte çalıştığı daha ileri bir aşamadır.',
        'Doğru-yanlış geri bildirimi sayesinde hangi karakter gruplarında hâlâ tereddüt yaşadığın açık şekilde görünür. Bu da pratik moduna geri dönüp hedefli tekrar yapmayı kolaylaştırır.'
      ],
      learningPoints: [
        'Rehbersiz karakter üretimini test eder',
        'Gerçek hatırlama seviyesini görünür kılar',
        'Zayıf karakterleri belirleyip geri çalışma fırsatı verir'
      ],
      demoSrc: '/gifs/drawing-test.gif',
      demoAlt: 'Test çizim modu demosu',
      fallbackTitle: 'Drawing Test Demo GIF',
      fallbackPath: '/gifs/drawing-test.gif'
    },
    {
      id: 'drawing-speed',
      title: 'Hızlı Tur',
      lead: 'Bir dakika içinde mümkün olduğunca çok karakter çizdiren tempo odaklı çalışma modudur.',
      paragraphs: [
        'Hızlı tur, karakterleri yavaş ve tek tek kurmaktan çıkıp daha akıcı biçimde üretmeyi hedefler. Burada kullanıcı hem doğru formu korumalı hem de ritmini kaybetmemelidir.',
        'Bu yapı, özellikle temel karakterleri öğrenmiş kullanıcılar için el hızını ve görsel karar verme süresini iyileştirir. Aynı zamanda tekrar temposu sayesinde yoğun bir kas hafızası çalışması sunar.'
      ],
      learningPoints: [
        'El hızını ve karar verme ritmini artırır',
        'Süre baskısı altında formu korumayı öğretir',
        'Kısa sürede yoğun tekrar yaptırır'
      ],
      demoSrc: '/gifs/drawing-speed.gif',
      demoAlt: 'Hızlı tur çizim modu demosu',
      fallbackTitle: 'Drawing Speed Demo GIF',
      fallbackPath: '/gifs/drawing-speed.gif'
    },
    {
      id: 'drawing-memory',
      title: 'Hafızadan Çizim',
      lead: 'Karakteri kısa süre görüp ardından hafızadan çizdiğin bu mod, en yüksek hatırlama seviyesini hedefler.',
      paragraphs: [
        'Hafızadan çizim modunda karakter ekranda kısa süre kalır ve ardından kaybolur. Kullanıcı artık görsel desteğe değil, zihnindeki karakter modeline dayanarak çizim yapar.',
        'Bu çalışma biçimi özellikle benzer şekilli kana karakterlerini ayırmada çok etkilidir. Çünkü doğru sonuca ulaşmak için karakterin ayırt edici çizgilerini gerçekten hatırlamak gerekir.'
      ],
      learningPoints: [
        'Görsel hafıza ile motor hafızayı birleştirir',
        'Benzer karakterleri daha net ayırmayı öğretir',
        'İleri seviye hatırlama pratiği sağlar'
      ],
      demoSrc: '/gifs/drawing-demo.gif',
      demoAlt: 'Hafızadan çizim modu demosu',
      fallbackTitle: 'Drawing Memory Demo GIF',
      fallbackPath: '/gifs/drawing-demo.gif'
    }
  ]
};

const trListeningSection: OverviewModalSection = {
  badge: 'Çalışma Modu',
  title: 'Kana Dinleme Pratiği',
  intro:
    'Listening alanı, işitsel tanımayı doğrudan cevap üretimiyle birleştirir. Kullanıcı sesi dinler, ayırt eder ve seçme, yazma veya çizme yoluyla tepki verir. Bu yüzden başlangıçtan ileri seviyeye kadar katmanlı bir öğrenme sunar.',
  mediaPosition: 'right',
  topics: [
    {
      id: 'listening-recognition',
      title: 'Recognition',
      lead: 'Duyulan sesi doğru kana ile eşleştiren en erişilebilir dinleme modudur.',
      paragraphs: [
        'Recognition akışında kullanıcı önce sesi duyar, ardından ekrandaki seçenekler arasından doğru karakteri bulur. Bu yöntem, yeni başlayanlar için dinleme pratiğine giriş yapmayı kolaylaştırır çünkü doğrudan yazı üretmek gerekmez.',
        'İyi distractor seçenekleri sayesinde bu mod yalnızca yüzeysel tanıma yapmaz; benzer ses veya biçimlerde gerçekten ayrım yapmayı öğretir. Böylece kullanıcı zor karakter çiftlerinde daha dikkatli dinlemeye başlar.'
      ],
      learningPoints: [
        'İşitsel ayırt etme becerisini güçlendirir',
        'Benzer kana seçenekleri arasında doğru kararı öğretir',
        'Dinleme pratiğine düşük bariyerli giriş sağlar'
      ],
      demoSrc: '/gifs/listening-recognition.gif',
      demoAlt: 'Recognition dinleme modu demosu',
      fallbackTitle: 'Listening Recognition Demo GIF',
      fallbackPath: '/gifs/listening-recognition.gif'
    },
    {
      id: 'listening-typing',
      title: 'Typing',
      lead: 'Ses -> romaji üretimi akışı, pasif dinlemeyi aktif recall ile birleştirir.',
      paragraphs: [
        'Bu modda kullanıcı sesi dinler ve doğru romajiyi input alanına girer. Seçenek desteği olmadığı için karakterin sesini gerçekten tanımak ve onu doğru yazı sistemine dönüştürmek gerekir.',
        'Alternatif romaji kabulü sayesinde sistem farklı yazım alışkanlıklarını da hesaba katar. Bu da modu hem pratik hem gerçek kullanım açısından daha esnek hale getirir.'
      ],
      learningPoints: [
        'Ses duyup romaji üretme akıcılığını artırır',
        'Hız, doğruluk ve streak ile performansı görünür kılar',
        'Seçeneksiz recall pratiği yaptırır'
      ],
      demoSrc: '/gifs/listening-typing.gif',
      demoAlt: 'Typing dinleme modu demosu',
      fallbackTitle: 'Listening Typing Demo GIF',
      fallbackPath: '/gifs/listening-typing.gif'
    },
    {
      id: 'listening-writing',
      title: 'Kana Writing',
      lead: 'Duyulan sesi doğrudan kana çizimine dönüştüren bu mod, listening alanının en zor ve en öğretici katmanıdır.',
      paragraphs: [
        'Kana Writing modunda kullanıcı sesi duyar ama karakteri görmez. Ardından canvas üzerinde doğru kana formunu çizmeye çalışır. Bu akış işitsel tanıma, görsel hafıza ve motor üretimi tek noktada birleştirir.',
        'Bu mod özellikle karakteri gerçekten içselleştirip içselleştirmediğini gösterir. Çünkü doğru sonuca ulaşmak için sesi tanımak yetmez; o sesin görsel formunu da zihinden eksiksiz çağırmak gerekir.'
      ],
      learningPoints: [
        'Ses -> karakter üretimi zincirini tam olarak çalıştırır',
        'Görsel hatırlama ile yazma pratiğini birleştirir',
        'İleri seviye kana içselleştirmesi sağlar'
      ],
      demoSrc: '/gifs/listening-demo.gif',
      demoAlt: 'Kana writing dinleme modu demosu',
      fallbackTitle: 'Listening Writing Demo GIF',
      fallbackPath: '/gifs/listening-demo.gif'
    }
  ]
};

const trDictionarySection: OverviewModalSection = {
  badge: 'Çalışma Modu',
  title: 'Kana Kelime Sözlüğü',
  intro:
    'Dictionary alanı, kana pratiğini kelime seviyesine taşır. Burada amaç yalnızca karakterleri tanımak değil, onları gerçek kelimeler içinde görmek, okumak ve test akışlarıyla kalıcı hale getirmektir.',
  mediaPosition: 'left',
  topics: [
    {
      id: 'dictionary-search',
      title: 'Aranabilir Sözlük',
      lead: 'Kelime listesini filtreleyip kana, romaji ve anlam ilişkilerini bağlam içinde incelemeyi sağlar.',
      paragraphs: [
        'Aranabilir sözlük yapısı, kullanıcıya tek tek karakterlerden çıkıp gerçek kelime örneklerine geçme imkanı sunar. Böylece kana bilgisi soyut kalmaz; günlük kullanımdaki karşılıklarıyla birlikte pekişir.',
        'Arama ve filtreleme akışı özellikle belirli JLPT seviyelerine veya belirli okuma kalıplarına odaklanmak isteyen kullanıcılar için düzenli bir tekrar zemini oluşturur.'
      ],
      learningPoints: [
        'Kana bilgisini gerçek kelimelere taşır',
        'Romaji ve anlamı birlikte inceleme fırsatı verir',
        'Hedefli arama ile odaklı tekrar sağlar'
      ],
      demoSrc: '/gifs/dictionary-search.gif',
      demoAlt: 'Sözlük arama demosu',
      fallbackTitle: 'Dictionary Search Demo GIF',
      fallbackPath: '/gifs/dictionary-search.gif'
    },
    {
      id: 'dictionary-typing',
      title: 'Kelime Typing Testi',
      lead: 'Kelime okuma ve romaji üretimini karakter seviyesinden kelime seviyesine taşır.',
      paragraphs: [
        'Kelime typing testi, kana karakterlerini izole halde tanımaktan daha ileri bir adımdır. Kullanıcı artık birden fazla karakterin oluşturduğu kelimeyi birlikte işler ve doğru romaji cevabını üretir.',
        'Bu çalışma biçimi özellikle okuma akışında harf harf çözümlemeden çıkıp daha bütünsel tanıma alışkanlığı kurar. Sık kullanılan kelimelerle çalışıldığında günlük okuma hızı da artar.'
      ],
      learningPoints: [
        'Kelime bütününü daha hızlı tanımayı öğretir',
        'Karakter seviyesinden akıcı okuma seviyesine geçiş sağlar',
        'Romaji üretimini gerçek kelime örnekleriyle pekiştirir'
      ],
      demoSrc: '/gifs/dictionary-typing.gif',
      demoAlt: 'Kelime typing testi demosu',
      fallbackTitle: 'Dictionary Typing Demo GIF',
      fallbackPath: '/gifs/dictionary-typing.gif'
    },
    {
      id: 'dictionary-mcq',
      title: 'Çoktan Seçmeli Test',
      lead: 'Kelime anlamı ve okuma eşleştirmesini daha hızlı tekrar etmek için kullanılan hafif giriş modudur.',
      paragraphs: [
        'Çoktan seçmeli test, kullanıcıyı yormadan çok sayıda kelimeyi kısa sürede tekrar etmeyi sağlar. Bu nedenle yeni kelime gruplarına ilk girişte veya tekrar öncesi ısınma aşamasında oldukça verimlidir.',
        'Seçenekli yapı daha düşük üretim baskısı sunsa da doğru distractorlarla birlikte kelime-okuş-anlam bağını netleştirir. Ardından typing testine geçmek için sağlam bir hazırlık sağlar.'
      ],
      learningPoints: [
        'Kelime tekrarını hızlandırır',
        'Anlam ve okuma eşleşmesini güçlendirir',
        'Daha zor üretim modları için giriş basamağı oluşturur'
      ],
      demoSrc: '/gifs/dictionary-mcq.gif',
      demoAlt: 'Çoktan seçmeli sözlük testi demosu',
      fallbackTitle: 'Dictionary Multiple Choice Demo GIF',
      fallbackPath: '/gifs/dictionary-mcq.gif'
    },
    {
      id: 'dictionary-levels',
      title: 'JLPT ve Filtre Akışı',
      lead: 'İçeriği seviyeye göre daraltmak, çalışma yükünü yönetilebilir ve ölçülebilir hale getirir.',
      paragraphs: [
        'JLPT filtresi sayesinde kullanıcı tüm sözlük içinde kaybolmadan kendi seviyesine uygun kelimeleri seçebilir. Bu, tekrar planını daha kontrollü kurmayı ve seviyeye göre istikrarlı ilerlemeyi kolaylaştırır.',
        'Filtre akışı yalnızca içerik azaltmak için değil, belirli bir sınava veya günlük hedefe göre çalışma seansları hazırlamak için de kullanışlıdır.'
      ],
      learningPoints: [
        'Seviyeye uygun çalışma havuzu oluşturur',
        'Büyük kelime listelerini yönetilebilir kılar',
        'Sınav veya hedef odaklı tekrar planı kurmayı kolaylaştırır'
      ],
      demoSrc: '/gifs/dictionary-demo.gif',
      demoAlt: 'JLPT filtre demosu',
      fallbackTitle: 'Dictionary JLPT Demo GIF',
      fallbackPath: '/gifs/dictionary-demo.gif'
    }
  ]
};

const enTypingSection: OverviewModalSection = {
  badge: 'Study Mode',
  title: 'Kana Typing Practice',
  intro:
    'The typing area turns kana recognition into active production. Instead of only spotting characters, the learner recalls the correct romaji, notices mistakes quickly, and builds reading fluency through short repetition loops.',
  mediaPosition: 'right',
  topics: [
    {
      id: 'typing-standard',
      title: 'Standard Mode',
      lead: 'The core flow where you see a kana and type its romaji counterpart.',
      paragraphs: [
        'This mode shows the kana directly and asks the learner to type the correct romaji. It is the clearest way to build an early reading habit because the visual form, the sound expectation, and the romanized answer are reinforced together.',
        'Standard mode also makes weak spots obvious very quickly. If a learner keeps hesitating on a row or mixing up similar symbols, the feedback loop exposes that friction immediately.'
      ],
      learningPoints: [
        'Builds fast kana -> romaji mapping',
        'Improves discrimination between similar characters',
        'Creates a strong baseline for speed and accuracy'
      ],
      demoSrc: '/gifs/typing-standard.gif',
      demoAlt: 'Standard typing mode demo',
      fallbackTitle: 'Typing Standard Demo GIF',
      fallbackPath: '/gifs/typing-standard.gif'
    },
    {
      id: 'typing-reverse',
      title: 'Romaji to Kana',
      lead: 'A reverse flow that pushes the learner from passive recognition into active recall.',
      paragraphs: [
        'Here the learner sees the romaji and must produce the matching kana. This is especially valuable for users who can recognize a character when shown, but still struggle to generate it themselves.',
        'Because the answer is not visible on screen, the mode strengthens the mental shape of each character and prepares the learner for handwriting or faster recall tasks.'
      ],
      learningPoints: [
        'Strengthens active character recall',
        'Teaches visual production from a romaji cue',
        'Works as a bridge toward writing practice'
      ],
      demoSrc: '/gifs/typing-reverse.gif',
      demoAlt: 'Reverse typing mode demo',
      fallbackTitle: 'Typing Reverse Demo GIF',
      fallbackPath: '/gifs/typing-reverse.gif'
    },
    {
      id: 'typing-timed',
      title: 'Beat the Clock',
      lead: 'A tempo-focused mode designed to measure automatic recognition under time pressure.',
      paragraphs: [
        'In the timed flow the goal is not only to answer correctly, but to keep a stable rhythm while doing so. Because many characters appear in a short window, hesitation becomes very visible.',
        'This makes the mode ideal for comparing progress across sessions. Speed, accuracy, and streak data together reveal whether the learner is moving from recognition into fluency.'
      ],
      learningPoints: [
        'Raises instant recall speed',
        'Improves focus under pressure',
        'Makes progress easy to track with score metrics'
      ],
      demoSrc: '/gifs/typing-demo.gif',
      demoAlt: 'Timed typing mode demo',
      fallbackTitle: 'Typing Timed Demo GIF',
      fallbackPath: '/gifs/typing-demo.gif'
    }
  ]
};

const enDrawingSection: OverviewModalSection = {
  badge: 'Study Mode',
  title: 'Kana Drawing Practice',
  intro:
    'The drawing area is about producing kana physically, not only recognizing it. It builds handwriting confidence, stroke awareness, and long-term retention through guided and memory-based drawing.',
  mediaPosition: 'left',
  topics: [
    {
      id: 'drawing-practice',
      title: 'Practice Mode',
      lead: 'A guided drawing flow that helps the learner build the correct form with support.',
      paragraphs: [
        'Practice mode shows the learner how the character is structured and gives enough guidance to draw it with confidence. This is the safest entry point when stroke order or shape still feels unfamiliar.',
        'The guide and direction cues do more than show where to draw. They teach how the character is built, which lowers friction later when the learner moves into unguided modes.'
      ],
      learningPoints: [
        'Teaches stroke structure step by step',
        'Stabilizes shape and spacing',
        'Provides a low-risk way to begin handwriting'
      ],
      demoSrc: '/gifs/drawing-practice.gif',
      demoAlt: 'Practice drawing mode demo',
      fallbackTitle: 'Drawing Practice Demo GIF',
      fallbackPath: '/gifs/drawing-practice.gif'
    },
    {
      id: 'drawing-test',
      title: 'Test Mode',
      lead: 'A more independent drawing flow that reveals how much of the form the learner truly remembers.',
      paragraphs: [
        'In test mode the learner draws with far less guidance. This makes it useful for checking whether the character shape is genuinely remembered rather than merely traced.',
        'Because the feedback is still direct, the user can quickly identify which character groups need another round in practice mode.'
      ],
      learningPoints: [
        'Tests unguided character production',
        'Reveals actual memory strength',
        'Helps target weak characters for focused review'
      ],
      demoSrc: '/gifs/drawing-test.gif',
      demoAlt: 'Test drawing mode demo',
      fallbackTitle: 'Drawing Test Demo GIF',
      fallbackPath: '/gifs/drawing-test.gif'
    },
    {
      id: 'drawing-speed',
      title: 'Speed Run',
      lead: 'A one-minute drawing sprint built for rhythm, confidence, and repetition density.',
      paragraphs: [
        'Speed Run pushes the learner to keep producing kana without overthinking every stroke. That makes it useful once the basics are already familiar and the next goal is smooth execution.',
        'The time pressure also helps expose which forms are still fragile, because hesitation appears immediately when tempo matters.'
      ],
      learningPoints: [
        'Improves drawing tempo and confidence',
        'Trains consistency under pressure',
        'Creates dense repetition in a short session'
      ],
      demoSrc: '/gifs/drawing-speed.gif',
      demoAlt: 'Speed drawing mode demo',
      fallbackTitle: 'Drawing Speed Demo GIF',
      fallbackPath: '/gifs/drawing-speed.gif'
    },
    {
      id: 'drawing-memory',
      title: 'Memory Draw',
      lead: 'The most demanding drawing mode, built around short exposure and full recall.',
      paragraphs: [
        'In Memory Draw the character appears briefly, disappears, and must then be recreated from memory. This pushes the learner to depend on a strong internal model of the kana.',
        'The mode is especially effective for separating visually similar characters, because the answer requires remembering the exact distinguishing strokes.'
      ],
      learningPoints: [
        'Combines visual memory with motor memory',
        'Sharpens separation between similar kana',
        'Provides advanced recall practice'
      ],
      demoSrc: '/gifs/drawing-demo.gif',
      demoAlt: 'Memory drawing mode demo',
      fallbackTitle: 'Drawing Memory Demo GIF',
      fallbackPath: '/gifs/drawing-demo.gif'
    }
  ]
};

const enListeningSection: OverviewModalSection = {
  badge: 'Study Mode',
  title: 'Kana Listening Practice',
  intro:
    'The listening area connects audio recognition with active response. The learner hears kana or vocabulary and then reacts by selecting, typing, or drawing, which creates a layered path from beginner listening to advanced recall.',
  mediaPosition: 'right',
  topics: [
    {
      id: 'listening-recognition',
      title: 'Recognition',
      lead: 'The most accessible listening mode: hear the sound and pick the right kana.',
      paragraphs: [
        'Recognition mode lets the learner hear an audio prompt and then choose the matching kana from a small set of options. Because it does not demand full text production, it works especially well as a first listening step.',
        'The value of the mode comes from how it trains distinction. Good distractors force the learner to listen carefully and separate similar sounds or visually close kana.'
      ],
      learningPoints: [
        'Strengthens audio discrimination',
        'Trains accurate choice among similar kana',
        'Provides a low-barrier entry into listening practice'
      ],
      demoSrc: '/gifs/listening-recognition.gif',
      demoAlt: 'Recognition listening mode demo',
      fallbackTitle: 'Listening Recognition Demo GIF',
      fallbackPath: '/gifs/listening-recognition.gif'
    },
    {
      id: 'listening-typing',
      title: 'Typing',
      lead: 'An audio -> romaji flow that turns passive listening into active recall.',
      paragraphs: [
        'In this mode the learner hears the sound and types the matching romaji without answer choices. That makes it much closer to real recall than multiple choice recognition.',
        'Alternative romaji handling keeps the system practical while still focusing on the core skill: hearing the sound clearly enough to produce the correct answer form.'
      ],
      learningPoints: [
        'Builds fluent audio -> romaji conversion',
        'Tracks performance with speed, accuracy, and streak',
        'Removes answer-choice support to force real recall'
      ],
      demoSrc: '/gifs/listening-typing.gif',
      demoAlt: 'Typing listening mode demo',
      fallbackTitle: 'Listening Typing Demo GIF',
      fallbackPath: '/gifs/listening-typing.gif'
    },
    {
      id: 'listening-writing',
      title: 'Kana Writing',
      lead: 'The most demanding listening flow: hear the sound and draw the kana from memory.',
      paragraphs: [
        'Kana Writing removes the visible character completely. The learner hears only the sound and must reproduce the kana on the canvas. This combines listening, visual memory, and motor output in one task.',
        'Because the learner must reconstruct the visual form from the sound alone, this mode reveals whether the kana has really been internalized.'
      ],
      learningPoints: [
        'Completes the full audio -> character production chain',
        'Combines recall and handwriting in one task',
        'Provides advanced kana internalization practice'
      ],
      demoSrc: '/gifs/listening-demo.gif',
      demoAlt: 'Kana writing listening mode demo',
      fallbackTitle: 'Listening Writing Demo GIF',
      fallbackPath: '/gifs/listening-demo.gif'
    }
  ]
};

const enDictionarySection: OverviewModalSection = {
  badge: 'Study Mode',
  title: 'Kana Vocabulary Dictionary',
  intro:
    'The dictionary area moves practice from isolated kana into real vocabulary. It helps the learner see kana inside usable words, connect them with meaning, and turn that exposure into structured review.',
  mediaPosition: 'left',
  topics: [
    {
      id: 'dictionary-search',
      title: 'Searchable Dictionary',
      lead: 'A browsing flow built for contextual study rather than isolated symbol review.',
      paragraphs: [
        'The searchable dictionary lets the learner move from kana drills into actual words. This makes kana knowledge less abstract because every item now appears with reading and meaning together.',
        'Filtering and lookup also support targeted study sessions, especially when the learner wants to focus on a level, a pattern, or a narrow review set.'
      ],
      learningPoints: [
        'Connects kana practice to real vocabulary',
        'Supports reading and meaning study together',
        'Enables focused review through search and filters'
      ],
      demoSrc: '/gifs/dictionary-search.gif',
      demoAlt: 'Dictionary search demo',
      fallbackTitle: 'Dictionary Search Demo GIF',
      fallbackPath: '/gifs/dictionary-search.gif'
    },
    {
      id: 'dictionary-typing',
      title: 'Word Typing Quiz',
      lead: 'A word-level typing flow that extends kana recall into full reading chunks.',
      paragraphs: [
        'Typing at the word level is a clear step beyond single-character practice. The learner now processes multiple kana together and turns that sequence into a correct romaji answer.',
        'This helps shift the reading habit from character-by-character decoding toward smoother word recognition.'
      ],
      learningPoints: [
        'Improves full-word recognition',
        'Bridges single-kana drills into reading fluency',
        'Reinforces romaji production with real vocabulary'
      ],
      demoSrc: '/gifs/dictionary-typing.gif',
      demoAlt: 'Dictionary typing quiz demo',
      fallbackTitle: 'Dictionary Typing Demo GIF',
      fallbackPath: '/gifs/dictionary-typing.gif'
    },
    {
      id: 'dictionary-mcq',
      title: 'Multiple Choice Test',
      lead: 'A lighter quiz mode for high-volume repetition and warm-up review.',
      paragraphs: [
        'Multiple choice testing lets the learner move through a large number of vocabulary items quickly. That makes it useful as a warm-up mode or as a first pass through unfamiliar words.',
        'Even though the response load is lighter, good distractors still strengthen the connection between reading and meaning.'
      ],
      learningPoints: [
        'Speeds up vocabulary repetition',
        'Strengthens reading-meaning matching',
        'Provides an easier entry into harder production modes'
      ],
      demoSrc: '/gifs/dictionary-mcq.gif',
      demoAlt: 'Dictionary multiple choice demo',
      fallbackTitle: 'Dictionary Multiple Choice Demo GIF',
      fallbackPath: '/gifs/dictionary-mcq.gif'
    },
    {
      id: 'dictionary-levels',
      title: 'JLPT and Filter Flow',
      lead: 'A control layer that keeps large vocabulary sets manageable and goal-oriented.',
      paragraphs: [
        'JLPT-based filtering prevents the learner from getting lost inside a very large dictionary. Instead, study sessions can be scoped to the right level and repeated with more intention.',
        'That makes the dictionary area useful not only for browsing, but also for building deliberate exam-focused or goal-focused review sets.'
      ],
      learningPoints: [
        'Creates level-appropriate study pools',
        'Makes large vocabulary lists manageable',
        'Supports exam-focused or goal-focused review planning'
      ],
      demoSrc: '/gifs/dictionary-demo.gif',
      demoAlt: 'Dictionary JLPT filter demo',
      fallbackTitle: 'Dictionary JLPT Demo GIF',
      fallbackPath: '/gifs/dictionary-demo.gif'
    }
  ]
};

export const overviewModalContent: Record<AppLanguage, OverviewModalCopy> = {
  tr: {
    close: 'Kapat',
    topicsLabel: 'Başlıklar',
    previewLabel: 'Aktif Önizleme',
    learningLabel: 'Bu bölümde neler öğrenilir?',
    sections: {
      typing: trTypingSection,
      drawing: trDrawingSection,
      listening: trListeningSection,
      dictionary: trDictionarySection
    }
  },
  en: {
    close: 'Close',
    topicsLabel: 'Topics',
    previewLabel: 'Active Preview',
    learningLabel: 'What do you learn here?',
    sections: {
      typing: enTypingSection,
      drawing: enDrawingSection,
      listening: enListeningSection,
      dictionary: enDictionarySection
    }
  }
};
