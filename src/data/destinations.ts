// Static content for the "Destinations" section (General Information, Visa,
// Tours, Sights). The backend has no destinations endpoint yet, so the
// content lives here and is localized for en / ru / tk. Once an API ships, these
// shapes can be filled from it without changing the pages.

export type DestLocale = "en" | "ru" | "tk";

export type Localized = Record<DestLocale, string>;

/** Compact helper to build a localized string. */
const L = (en: string, ru: string, tk: string): Localized => ({ en, ru, tk });

export interface SectionImage {
  src: string;
  caption: Localized;
}

export interface InfoSection {
  /** anchor id + sidebar key */
  id: string;
  /** icon key mapped to a react-icon in the component */
  icon: string;
  title: Localized;
  /** HTML body */
  body: Localized;
  images?: SectionImage[];
}

export interface Destination {
  slug: string;
  name: Localized;
  /** may contain <br/> for the hero */
  heroTitle: Localized;
  heroImage: string;
  intro: Localized;
  sections: InfoSection[];
  visa: Localized;
}

// ───────────────────────── Turkmenistan ─────────────────────────

const turkmenistan: Destination = {
  slug: "turkmenistan",
  name: L("Turkmenistan", "Туркменистан", "Türkmenistan"),
  heroTitle: L(
    "Travel to Turkmenistan",
    "Путешествие в Туркменистан",
    "Türkmenistana syýahat",
  ),
  heroImage: "/Cards/tm.jpg",
  intro: L(
    "Being the heart of the Great Silk Road, Turkmenistan has unique nature, a favourable climate, remarkable national values, distinctive customs and traditions, and an abundance of historical and architectural monuments. Open-hearted and hospitable people live in the country, which can be called a paradise for tourists who strive for discoveries and new emotions.",
    "Будучи сердцем Великого шёлкового пути, Туркменистан обладает уникальной природой, благоприятным климатом, замечательными национальными ценностями, самобытными обычаями и традициями, а также обилием исторических и архитектурных памятников. В стране живут открытые и гостеприимные люди, и её можно назвать раем для туристов, стремящихся к открытиям и новым эмоциям.",
    "Beýik Ýüpek ýolunyň ýüregi bolan Türkmenistan özboluşly tebigaty, amatly howasy, ajaýyp milli gymmatlyklary, özboluşly däp-dessurlary hem-de köp sanly taryhy we binagärlik ýadygärlikleri bilen tanalýar. Bu ýurtda göwni açyk we myhmansöýer adamlar ýaşaýar.",
  ),
  sections: [
    {
      id: "overview",
      icon: "overview",
      title: L("Overview", "Обзор", "Umumy maglumat"),
      body: L(
        `<p>Present-day Turkmenistan captivates guests and tourists with its developed city infrastructure. For example, the capital of the country, Ashgabat, was included in the Guinness World Records for the highest concentration of white marble buildings.</p>
         <h3>History</h3>
         <p>Turkmenistan is one of the most ancient countries. Its territory had been an important part of the Great Silk Road, connecting the West and the East for centuries. This land is a hearth of the most ancient Eastern civilizations. Travellers can discover the legendary country of Margiana (Ancient Merv or Margush), recognized as the fifth centre of world civilization, along with ancient Egypt, China, India and Mesopotamia. Ancient Merv, Kunya-Urgench and the Parthian Fortresses of Nisa are included on the UNESCO World Heritage List.</p>`,
        `<p>Современный Туркменистан очаровывает гостей и туристов развитой городской инфраструктурой. Так, столица страны Ашхабад занесена в Книгу рекордов Гиннесса за наибольшую концентрацию зданий из белого мрамора.</p>
         <h3>История</h3>
         <p>Туркменистан — одна из древнейших стран. Его территория была важной частью Великого шёлкового пути, веками соединявшего Запад и Восток. Эта земля — очаг древнейших восточных цивилизаций. Путешественники могут открыть для себя легендарную страну Маргиану (древний Мерв, или Маргуш), признанную пятым центром мировой цивилизации наряду с древним Египтом, Китаем, Индией и Месопотамией. Древний Мерв, Куня-Ургенч и Парфянские крепости Нисы включены в Список Всемирного наследия ЮНЕСКО.</p>`,
        `<p>Häzirki zaman Türkmenistan ösen şäher düzümi bilen myhmanlary haýran galdyrýar. Mysal üçin, ýurduň paýtagty Aşgabat ak mermerden bina edilen jaýlaryň iň köp jemlenen şäheri hökmünde Ginnesiň rekordlar kitabyna girizildi.</p>
         <h3>Taryh</h3>
         <p>Türkmenistan iň gadymy ýurtlaryň biridir. Onuň çägi asyrlaryň dowamynda Gündogary we Günbatary birleşdiren Beýik Ýüpek ýolunyň möhüm bölegi bolupdyr. Gadymy Merw, Köneürgenç we Nusaý galalary ÝUNESKO-nyň Bütindünýä mirasynyň sanawyna girizildi.</p>`,
      ),
      images: [
        {
          src: "/Cards/merv.jpg",
          caption: L(
            "Ancient Merv — UNESCO World Heritage Site",
            "Древний Мерв — объект Всемирного наследия ЮНЕСКО",
            "Gadymy Merw — ÝUNESKO-nyň Bütindünýä mirasy",
          ),
        },
        {
          src: "/Cards/urgench.jpg",
          caption: L(
            "Kunya-Urgench — UNESCO World Heritage Site",
            "Куня-Ургенч — объект Всемирного наследия ЮНЕСКО",
            "Köneürgenç — ÝUNESKO-nyň Bütindünýä mirasy",
          ),
        },
      ],
    },
    {
      id: "flights",
      icon: "flights",
      title: L("Flights", "Авиаперелёты", "Uçar gatnawlary"),
      body: L(
        "<p>Ashgabat International Airport is the main gateway into the country. Turkmenistan Airlines operates direct flights to several cities in Asia, the Middle East and Europe. International travellers usually connect through Istanbul, Dubai or Almaty.</p>",
        "<p>Международный аэропорт Ашхабада — главные воздушные ворота страны. «Туркменские авиалинии» выполняют прямые рейсы в ряд городов Азии, Ближнего Востока и Европы. Международные путешественники обычно делают пересадку в Стамбуле, Дубае или Алматы.</p>",
        "<p>Aşgabadyň halkara howa menzili ýurda girýän esasy derwezedir. «Türkmenhowaýollary» Aziýanyň, Ýakyn Gündogaryň we Ýewropanyň birnäçe şäherine göni gatnawlary amala aşyrýar.</p>",
      ),
    },
    {
      id: "safety",
      icon: "safety",
      title: L("Safety", "Безопасность", "Howpsuzlyk"),
      body: L(
        "<p>Travel safety most often becomes a major factor when choosing a tourist destination. In this context, Turkmenistan is beyond comparison. It is the world’s safest country! This fact was confirmed by the Gallup Inc., an analytics and advisory company, known for its public opinion polls conducted worldwide. In October 2020, the company published the Global Law and Order Index, which contains a list of the safest countries on the Earth.</br>In the Index, Turkmenistan shared the first place with Singapore; both countries scored 97 points out of 100. This index a composite score based on the incidence of theft and assault or mugging, and people's reported confidence in their local police, their feelings of personal safety in the past year. The higher the score, the higher the proportion of the population that reports feeling secure.</br>Moreover, to date, Turkmenistan has a zero level of terrorist threat. These results are based on the research by the Institute for Economics and Peace, headquartered in Sydney, Australia.</p>",
        "<p>Безопасность путешествий чаще всего становится главным фактором при выборе туристического направления. В этом контексте Туркменистан вне конкуренции. Это самая безопасная страна в мире! Этот факт подтвердила аналитическая и консалтинговая компания Gallup Inc., известная своими опросами общественного мнения по всему миру. В октябре 2020 года компания опубликовала Глобальный индекс закона и порядка (Global Law and Order Index), который содержит список самых безопасных стран на Земле. </br> В этом Индексе Туркменистан разделил первое место с Сингапуром; обе страны набрали 97 баллов из 100. Этот индекс представляет собой комплексную оценку, основанную на частоте краж, нападений или грабежей, а также на уровне доверия граждан к местной полиции и их ощущении личной безопасности за прошедший год. Чем выше балл, тем выше доля населения, заявляющая, что чувствует себя в безопасности. </br>Более того, на сегодняшний день в Туркменистане зафиксирован нулевой уровень террористической угрозы. Эти результаты основаны на исследовании Института экономики и мира, штаб-квартира которого находится в Сиднее, Австралия.</p>",
        "<p>Syýahat howpsuzlygy syýahatçylyk ugruny saýlamakda köplenç iň esasy şertleriň birine öwrülýär. Bu babatda Türkmenistan bilen bäsleşipjek ýurt ýokdur. Ol dünýäniň iň howpsuz ýurdudyr! Bu hakykat bütin dünýäde jemgyýetçilik pikirini öwrenmek boýunça geçirýän sowallary bilen tanalýan «Gallup Inc.» analitiki we maslahat beriş kompaniýasy tarapyndan tassyklanyldy. 2020-nji ýylyň oktýabr aýynda kompaniýa Ýer ýüzündäki iň howpsuz ýurtlaryň sanawyny öz içine alýan Global kanun we tertip indeksini (Global Law and Order Index) çap etdi.Bu Indeksde Türkmenistan Singapur bilen birinji orny paýlaşdy; iki ýurt hem 100 baldan 97 bal toplady. </br>Bu indeks ogurlyk, hüjüm ýa-da talaňçylyk ýaly ýagdaýlaryň ýygylygyna, şeýle hem adamlaryň ýerli polisiýa bolan ynamyna we geçen ýylyň dowamynda özlerini şahsy taýdan nähihowly duýandyklaryna esaslanýan hemmetaraplaýyn görkezijidir. Bal näçe ýokary bolsa, özüni howpsuz şertlerde duýýandygyny mälim edýän ilatyň paýy hem şonça ýokary bolýar.</br>Mundan başga-da, şu güne çenli Türkmenistanda terrorçylyk howpunyň derejesi nola deňdir. Bu netijeler ştab-kwartirasy Awstraliýanyň Sidneý şäherinde ýerleşýän Ykdysadyýet we parahatçylyk institutynyň geçiren barlaglaryna esaslanýar.</p>",
      ),
    },
    {
      id: "traditions",
      icon: "traditions",
      title: L("Traditions", "Традиции", "Däp-dessurlar"),
      body: L(
        "<p>Turkmen culture is famous for its hand-woven carpets, whose intricate patterns are a national symbol featured on the state flag. Hospitality, respect for elders and rich oral epic poetry are at the heart of everyday life.</p>",
        "<p>Туркменская культура славится коврами ручной работы, замысловатые узоры которых являются национальным символом и изображены на государственном флаге. В основе повседневной жизни — гостеприимство, уважение к старшим и богатая устная эпическая поэзия.</p>",
        "<p>Türkmen medeniýeti el bilen dokalan halylary bilen meşhurdyr; olaryň nepis nagyşlary döwlet baýdagynda şekillendirilen milli nyşandyr. Myhmansöýerlik we ululara hormat goýmak gündelik durmuşyň özenidir.</p>",
      ),
    },
    {
      id: "cuisine",
      icon: "cuisine",
      title: L("Turkmen Cuisine", "Туркменская кухня", "Türkmen aşhanasy"),
      body: L(
        "<p>Turkmen cuisine is hearty, meat-based and very distinctive. Due to the nomadic past, simple yet incredibly flavourful cooking methods prevail here.</p><ul><li><strong>Turkmen plov (palov):</strong> Unlike neighbouring countries, it is often prepared with game or lamb meat, sometimes with sour berries or sea buckthorn juice added.</li><li><strong>Ishlikli:</strong> A traditional closed pie with juicy minced meat and onion, which nomads have baked since ancient times directly in hot sand under coals.</li><li><strong>Tamdýrlama:</strong> Lamb slow-cooked in a special clay oven (tandyr), which literally melts in your mouth.</li><li><strong>Chal:</strong> A drink made from camel milk, excellent for quenching thirst in the heat.</li></ul>",
        "<p>Туркменская кухня сытная, мясная и очень самобытная. Из-за кочевого прошлого здесь преобладают простые, но невероятно вкусные технологии приготовления.</p><ul><li><strong>Туркменский плов (палов):</strong> В отличие от соседних стран, здесь его часто готовят с использованием мяса дичи или баранины, иногда добавляя кислые ягоды или сок облепихи.</li><li><strong>Ишликли:</strong> Традиционный закрытый пирог с сочным мясным фаршем и луком, который кочевники испокон веков запекали прямо в раскаленном песке под углями.</li><li><strong>Тамдырлама:</strong> Баранина, томленая в специальной глиняной печи (тамдыре), которая буквально тает во рту.</li><li><strong>Чал:</strong> Напиток из верблюжьего молока, отлично утоляющий жажду в жару.</li></ul>",
        "<p>Türkmen aşhanasy doýgun, etli we örän özboluşlydyr. Göçme geçmiş sebäpli bu ýerde ýönekeý, ýöne ajaýyp tagamly bişiriş usullary öňe çykýar.</p><ul><li><strong>Türkmen palawy:</strong> Golaýdaky ýurtlardan tapawutlylykda, ony köplenç ýabany haýwan eti ýa-da goýun eti bilen bişirýärler, käte goşar goýberýärler ýa-da çynar şiresi goşýarlar.</li><li><strong>Işlikli:</strong> Göçmenler gadymdan gyzgyn gumda kömür astynda bişiren, şireli et we soňan bilen doldurylan däpki ýapyk çörek.</li><li><strong>Tamdyrlama:</strong> Ýörite galyň tamdyrda ýuwaş bişirilen goýun eti, agzyňyzda erýär.</li><li><strong>Çal:</strong> Düşünde susuzlygy gowşadyjy deve süýdi hasabyndaky içgi.</li></ul>",
      ),
      images: [
        {
          src: "/Cards/plov.jpg",
          caption: L(
            "Turkmen plov (palov)",
            "Туркменский плов (палов)",
            "Türkmen palawy",
          ),
        },
        {
          src: "/Cards/ishlekli.jpg",
          caption: L("Ishlikli", "Ишликли", "Işlikli"),
        },
      ],
    },
  ],
  visa: L(
    `<p>Most foreign nationals need a visa to enter Turkmenistan. The standard route is a <strong>tourist visa</strong> issued on the basis of a Letter of Invitation (LOI), which a licensed local travel agency (such as Sayoda Travel) arranges for you before arrival.</p>
     <ol>
       <li>Choose a tour and confirm dates with the agency.</li>
       <li>Send a passport copy and a completed application form.</li>
       <li>Receive the approved Letter of Invitation (usually 2–3 weeks).</li>
       <li>Collect the visa at a Turkmen embassy or on arrival at Ashgabat airport.</li>
     </ol>
     <p>Transit visas (up to 5 days) are also available for travellers crossing the country.</p>`,
    `<p>Большинству иностранных граждан для въезда в Туркменистан требуется виза. Стандартный вариант — <strong>туристическая виза</strong>, оформляемая на основании письма-приглашения (LOI), которое для вас готовит лицензированное местное турагентство (например, Sayoda Travel) до прибытия.</p>
     <ol>
       <li>Выберите тур и согласуйте даты с агентством.</li>
       <li>Отправьте копию паспорта и заполненную анкету.</li>
       <li>Получите одобренное письмо-приглашение (обычно 2–3 недели).</li>
       <li>Получите визу в посольстве Туркменистана или по прибытии в аэропорту Ашхабада.</li>
     </ol>
     <p>Также доступны транзитные визы (до 5 дней) для путешественников, пересекающих страну.</p>`,
    `<p>Daşary ýurt raýatlarynyň köpüsine Türkmenistana girmek üçin wiza gerek. Adaty ýol — ýerli ygtyýarly syýahatçylyk agentliginiň (mysal üçin, Sayoda Travel) taýýarlaýan çakylyk hatynyň (LOI) esasynda berilýän <strong>syýahatçylyk wizasy</strong>.</p>
     <ol>
       <li>Tur saýlaň we seneleri agentlik bilen ylalaşyň.</li>
       <li>Pasportyň nusgasyny we doldurylan arzany iberiň.</li>
       <li>Tassyklanan çakylyk hatyny alyň (adatça 2–3 hepde).</li>
       <li>Wizany Türkmenistanyň ilçihanasynda ýa-da Aşgabat howa menzilinde alyň.</li>
     </ol>`,
  ),
};

// Shared builder for the four supporting countries keeps the file compact while
// still giving each its own localized text.
interface CountrySeed {
  slug: string;
  name: Localized;
  heroImage: string;
  intro: Localized;
  overview: Localized;
  flights: Localized;
  safety: Localized;
  traditions: Localized;
  cuisineTitle: Localized;
  cuisine: Localized;
  cuisineImages?: SectionImage[];
  visa: Localized;
}

const buildDestination = (s: CountrySeed): Destination => ({
  slug: s.slug,
  name: s.name,
  heroTitle: {
    en: `Travel to ${s.name.en}`,
    ru: `Путешествие в ${s.name.ru}`,
    tk: `${s.name.tk}a syýahat`,
  },
  heroImage: s.heroImage,
  intro: s.intro,
  sections: [
    {
      id: "overview",
      icon: "overview",
      title: L("Overview", "Обзор", "Umumy maglumat"),
      body: s.overview,
    },
    {
      id: "flights",
      icon: "flights",
      title: L("Flights", "Авиаперелёты", "Uçar gatnawlary"),
      body: s.flights,
    },
    {
      id: "safety",
      icon: "safety",
      title: L("Safety", "Безопасность", "Howpsuzlyk"),
      body: s.safety,
    },

    {
      id: "traditions",
      icon: "traditions",
      title: L("Traditions", "Традиции", "Däp-dessurlar"),
      body: s.traditions,
    },
    {
      id: "cuisine",
      icon: "cuisine",
      title: s.cuisineTitle,
      body: s.cuisine,
      ...(s.cuisineImages?.length ? { images: s.cuisineImages } : {}),
    },
  ],
  visa: s.visa,
});

// ───────────────────────── Uzbekistan ─────────────────────────

const uzbekistan = buildDestination({
  slug: "uzbekistan",
  name: L("Uzbekistan", "Узбекистан", "Özbegistan"),
  heroImage: "/Cards/uz.jpg",
  intro: L(
    "Uzbekistan is the jewel of the Silk Road, home to the legendary cities of Samarkand, Bukhara and Khiva. Dazzling blue-tiled madrasahs, bustling bazaars and warm hospitality make it one of Central Asia's most rewarding destinations.",
    "Узбекистан — жемчужина Шёлкового пути, родина легендарных городов Самарканда, Бухары и Хивы. Ослепительные медресе в голубой плитке, шумные базары и тёплое гостеприимство делают его одним из самых ярких направлений Центральной Азии.",
    "Özbegistan — Ýüpek ýolunyň göwheri, rowaýata öwrülen Samarkant, Buhara we Hywa şäherleriniň mekany. Gök kaşinli medreseler we myhmansöýerlik ony Merkezi Aziýanyň iň özüne çekiji ýerleriniň birine öwürýär.",
  ),
  overview: L(
    "<p>With a history spanning more than 2,500 years, Uzbekistan sits at the crossroads of the ancient trade routes between East and West. Samarkand's Registan, Bukhara's old town and Khiva's walled Itchan Kala are all UNESCO World Heritage Sites.</p>",
    "<p>Имея историю более 2500 лет, Узбекистан расположен на перекрёстке древних торговых путей между Востоком и Западом. Регистан в Самарканде, старый город Бухары и обнесённая стенами Ичан-Кала в Хиве внесены в Список Всемирного наследия ЮНЕСКО.</p>",
    "<p>2500 ýyldan gowrak taryhy bolan Özbegistan Gündogar bilen Günbataryň arasyndaky gadymy söwda ýollarynyň çatrygynda ýerleşýär. Samarkandyň Registany, Buharanyň köne şäheri we Hywanyň Içan-Galasy ÝUNESKO mirasydyr.</p>",
  ),
  flights: L(
    "<p>Tashkent International Airport is the main hub, with direct flights from many European, Middle Eastern and Asian cities. Domestic flights and a modern high-speed train link Tashkent, Samarkand and Bukhara.</p>",
    "<p>Международный аэропорт Ташкента — главный авиаузел, с прямыми рейсами из многих городов Европы, Ближнего Востока и Азии. Внутренние рейсы и современный скоростной поезд связывают Ташкент, Самарканд и Бухару.</p>",
    "<p>Daşkendiň halkara howa menzili esasy merkez bolup, Ýewropanyň we Aziýanyň köp şäherinden göni gatnawlary bar. Ýokary tizlikli otly Daşkendi, Samarkandy we Buharany birleşdirýär.</p>",
  ),
  safety: L(
    "<p>Uzbekistan is a safe and welcoming country for travellers. Petty crime is uncommon and locals are famously helpful to visitors. Standard travel precautions are sufficient.</p>",
    "<p>Узбекистан — безопасная и гостеприимная страна для путешественников. Мелкие преступления редки, а местные жители славятся своей готовностью помочь гостям. Достаточно обычных мер предосторожности.</p>",
    "<p>Özbegistan syýahatçylar üçin howpsuz we myhmansöýer ýurt. Ownuk jenaýatlar seýrek, ýerli ilat myhmanlara kömek etmegi bilen tanalýar.</p>",
  ),
  traditions: L(
    "<p>Uzbek culture blends Persian, Turkic and Islamic heritage. Suzani embroidery, ceramics from Rishtan and the art of carpet-weaving are passed down through generations, while the teahouse (chaikhana) remains the centre of social life.</p>",
    "<p>Узбекская культура сочетает персидское, тюркское и исламское наследие. Вышивка сюзане, керамика из Риштана и искусство ковроткачества передаются из поколения в поколение, а чайхана остаётся центром общественной жизни.</p>",
    "<p>Özbek medeniýeti pars, türki we yslam mirasyny birleşdirýär. Süzene keşdesi, Riştan keramikasy we haly dokamak sungaty nesilden-nesle geçýär; çaýhana jemgyýetçilik durmuşynyň merkezi bolup galýar.</p>",
  ),
  cuisineTitle: L("Uzbek Cuisine", "Узбекская кухня", "Özbek aşhanasy"),
  cuisine: L(
    "<p>Uzbek plov (osh) is the national dish, cooked in giant kazan cauldrons. Other favourites include samsa, lagman noodles, shashlik and freshly baked non bread, all served with abundant green tea.</p>",
    "<p>Узбекский плов (ош) — национальное блюдо, готовится в огромных казанах. Среди других любимых блюд — самса, лагман, шашлык и свежеиспечённые лепёшки нон, подаваемые с обилием зелёного чая.</p>",
    "<p>Özbek palawy (oş) — milli tagam, uly gazanlarda taýýarlanýar. Beýleki tagamlar: somsa, lagman, şaşlyk we täze bişirilen non, hemmesi ýaşyl çaý bilen hödürlenýär.</p>",
  ),
  cuisineImages: [
    {
      src: "/Cards/plovUzbek.jpg",
      caption: L(
        "Uzbek plov (osh)",
        "Узбекский плов (ош)",
        "Özbek palawy (oş)",
      ),
    },
    {
      src: "/Cards/lagman.jpg",
      caption: L("Uzbek lagman", "Узбекский лагман", "Özbek lagmany"),
    },
  ],
  visa: L(
    "<p>Uzbekistan offers visa-free entry to many nationalities and a convenient <strong>e-visa</strong> for others, usually issued within a few business days. Sayoda Travel can advise on requirements and prepare supporting documents for your trip.</p>",
    "<p>Узбекистан предоставляет безвизовый въезд гражданам многих стран и удобную <strong>электронную визу</strong> для остальных, обычно оформляемую за несколько рабочих дней. Sayoda Travel поможет с требованиями и подготовит сопроводительные документы.</p>",
    "<p>Özbegistan köp ýurduň raýatlaryna wizasyz girmäge mümkinçilik berýär, beýlekiler üçin amatly <strong>elektron wiza</strong> birnäçe iş gününde resmileşdirilýär. Sayoda Travel resminamalary taýýarlamaga kömek eder.</p>",
  ),
});

// ───────────────────────── Kazakhstan ─────────────────────────

const kazakhstan = buildDestination({
  slug: "kazakhstan",
  name: L("Kazakhstan", "Казахстан", "Gazagystan"),
  heroImage: "/Cards/kaz.jpg",
  intro: L(
    "Kazakhstan is the world's largest landlocked country, a land of endless steppe, snow-capped mountains and ultramodern cities. From the futuristic capital Astana to the canyons of Charyn, it offers nature and adventure on an epic scale.",
    "Казахстан — крупнейшая в мире страна без выхода к морю, край бескрайних степей, заснеженных гор и сверхсовременных городов. От футуристической столицы Астаны до каньонов Чарына он предлагает природу и приключения эпического масштаба.",
    "Gazagystan — dünýäde deňze çykalgasy bolmadyk iň uly ýurt, çäksiz sähralaryň, garly daglaryň we häzirki zaman şäherleriniň ýurdy. Astanadan Çaryn jülgelerine çenli ol tebigaty we başdan geçirmeleri hödürleýär.",
  ),
  overview: L(
    "<p>Spanning Central Asia and Eastern Europe, Kazakhstan blends nomadic heritage with rapid modern development. Almaty, the leafy former capital, sits beneath the Tian Shan, while Astana dazzles with bold contemporary architecture.</p>",
    "<p>Раскинувшись на территории Центральной Азии и Восточной Европы, Казахстан сочетает кочевое наследие с быстрым современным развитием. Зелёный Алматы, бывшая столица, лежит у подножия Тянь-Шаня, а Астана поражает смелой современной архитектурой.</p>",
    "<p>Merkezi Aziýany we Gündogar Ýewropany öz içine alýan Gazagystan göçme mirasy häzirki zaman ösüşi bilen birleşdirýär. Almaty Týan-Şanyň eteginde ýerleşýär, Astana bolsa batyrgaý binagärligi bilen haýran galdyrýar.</p>",
  ),
  flights: L(
    "<p>Almaty and Astana international airports connect Kazakhstan with Europe, Asia and the Middle East. The national carrier Air Astana and low-cost FlyArystan serve an extensive domestic network.</p>",
    "<p>Международные аэропорты Алматы и Астаны связывают Казахстан с Европой, Азией и Ближним Востоком. Национальный перевозчик Air Astana и лоукостер FlyArystan обслуживают обширную внутреннюю сеть.</p>",
    "<p>Almaty we Astana halkara howa menzilleri Gazagystany Ýewropa, Aziýa we Ýakyn Gündogar bilen birleşdirýär. Air Astana we FlyArystan giň içerki ulgama hyzmat edýär.</p>",
  ),
  safety: L(
    "<p>Kazakhstan is generally safe for tourists, with welcoming people and good infrastructure in the main cities. Normal urban precautions apply, especially in crowded markets.</p>",
    "<p>Казахстан в целом безопасен для туристов: приветливые люди и хорошая инфраструктура в крупных городах. Достаточно обычных городских мер предосторожности, особенно на людных рынках.</p>",
    "<p>Gazagystan syýahatçylar üçin umuman howpsuz, esasy şäherlerde gowy düzüm we myhmansöýer adamlar bar. Köpçülikli bazarlarda adaty seresaplyk ýeterlik.</p>",
  ),
  traditions: L(
    "<p>Nomadic culture runs deep in Kazakh identity — from the felt yurt and eagle hunting (berkutchi) to the dombra lute and epic oral poetry. Hospitality to travellers is a sacred duty.</p>",
    "<p>Кочевая культура глубоко укоренена в казахской идентичности — от войлочной юрты и охоты с беркутом (беркутчи) до домбры и эпической устной поэзии. Гостеприимство к путникам — священный долг.</p>",
    "<p>Göçme medeniýeti gazak köküniň çuňňur bölegidir — keçe öýden we bürgüt awundan dombra we epiki şygyrlara çenli. Syýahatçylara myhmansöýerlik mukaddes borçdur.</p>",
  ),
  cuisineTitle: L("Kazakh Cuisine", "Казахская кухня", "Gazak aşhanasy"),
  cuisine: L(
    "<p>Beshbarmak — boiled meat with flat noodles — is the national dish, traditionally eaten by hand. Kazakhs also enjoy kazy (horse sausage), baursak fried dough and the fermented mare's milk kumys.</p>",
    "<p>Бешбармак — отварное мясо с плоской лапшой — национальное блюдо, которое традиционно едят руками. Казахи также любят казы (конскую колбасу), баурсаки и кумыс из кобыльего молока.</p>",
    "<p>Beşbarmak — milli tagam, adatça el bilen iýilýär. Gazaklar gazy, bauyrsak we gymyz hem halaýar.</p>",
  ),
  cuisineImages: [
    {
      src: "/Cards/beshbarmak.jpg",
      caption: L("Beshbarmak", "Бешбармак", "Beşbarmak"),
    },
    {
      src: "/Cards/baursak.jpeg",
      caption: L("Baursak", "Баурсак", "Bauyrsak"),
    },
  ],
  visa: L(
    "<p>Kazakhstan offers <strong>visa-free travel</strong> for citizens of many countries (typically up to 30 days) and a straightforward e-visa for others. Registration is handled automatically on arrival at international airports.</p>",
    "<p>Казахстан предоставляет <strong>безвизовый въезд</strong> гражданам многих стран (обычно до 30 дней) и простую электронную визу для остальных. Регистрация осуществляется автоматически по прибытии в международные аэропорты.</p>",
    "<p>Gazagystan köp ýurduň raýatlaryna <strong>wizasyz</strong> syýahaty (adatça 30 güne çenli) we beýlekiler üçin ýönekeý e-wizany hödürleýär. Hasaba alyş howa menzillerinde awtomatiki amala aşyrylýar.</p>",
  ),
});

// ───────────────────────── Kyrgyzstan ─────────────────────────

const kyrgyzstan = buildDestination({
  slug: "kyrgyzstan",
  name: L("Kyrgyzstan", "Кыргызстан", "Gyrgyzystan"),
  heroImage: "/Cards/kg.webp",
  intro: L(
    "Kyrgyzstan is a paradise for mountain lovers — over 90% of the country is covered by the Tian Shan and Pamir ranges. Alpine lakes, summer yurt camps and a living nomadic culture make it Central Asia's premier trekking destination.",
    "Кыргызстан — рай для любителей гор: более 90% территории страны покрыто хребтами Тянь-Шаня и Памира. Высокогорные озёра, летние юрточные лагеря и живая кочевая культура делают его главным трекинговым направлением Центральной Азии.",
    "Gyrgyzystan dag söýüjiler üçin jennet — ýurduň 90%-den gowragy Týan-Şan we Pamir daglary bilen örtülen. Belent köller, tomusky öý düşelgeleri we göçme medeniýeti ony Merkezi Aziýanyň esasy trekking ýerine öwürýär.",
  ),
  overview: L(
    "<p>Known as the 'Switzerland of Central Asia', Kyrgyzstan rewards travellers with pristine landscapes and genuine hospitality. The shimmering Lake Issyk-Kul, the world's second-largest alpine lake, is the country's crown jewel.</p>",
    "<p>Известный как «Швейцария Центральной Азии», Кыргызстан дарит путешественникам нетронутые ландшафты и искреннее гостеприимство. Сверкающее озеро Иссык-Куль, второе по величине горное озеро в мире, — главная жемчужина страны.</p>",
    "<p>«Merkezi Aziýanyň Şweýsariýasy» diýlip atlandyrylýan Gyrgyzystan syýahatçylara arassa tebigaty we çyn myhmansöýerligi hödürleýär. Yssyk-Köl, dünýäniň ikinji uly dag köli, ýurduň göwheri.</p>",
  ),
  flights: L(
    "<p>Manas International Airport in Bishkek is the main entry point, with connections via Istanbul, Almaty and the Gulf. Osh in the south offers a second international gateway near the Fergana Valley.</p>",
    "<p>Международный аэропорт Манас в Бишкеке — главный пункт въезда, со стыковками через Стамбул, Алматы и страны Персидского залива. Ош на юге — второй международный узел рядом с Ферганской долиной.</p>",
    "<p>Bişkekdäki Manas halkara howa menzili esasy giriş nokady. Günortadaky Oş Fergana jülgesiniň golaýynda ikinji halkara derweze hödürleýär.</p>",
  ),
  safety: L(
    "<p>Kyrgyzstan is friendly and safe for independent travellers, including trekkers. Mountain weather can change quickly, so guided treks and proper gear are recommended for remote areas.</p>",
    "<p>Кыргызстан дружелюбен и безопасен для самостоятельных путешественников, включая треккеров. Горная погода может быстро меняться, поэтому для удалённых районов рекомендуются сопровождаемые походы и хорошее снаряжение.</p>",
    "<p>Gyrgyzystan özbaşdak syýahatçylar üçin dostlukly we howpsuz. Dag howasy çalt üýtgäp biler, şonuň üçin uzak ýerlerde gollanmaly ýöriş we enjamlar maslahat berilýär.</p>",
  ),
  traditions: L(
    "<p>The Kyrgyz are heirs to a proud nomadic heritage, immortalised in the world's longest epic poem, Manas. Felt shyrdak rugs, the white kalpak hat and eagle hunting remain living symbols of national identity.</p>",
    "<p>Кыргызы — наследники гордого кочевого наследия, увековеченного в самой длинной эпической поэме мира — «Манас». Войлочные ширдаки, белый калпак и охота с беркутом остаются живыми символами национальной идентичности.</p>",
    "<p>Gyrgyzlar buýsançly göçme mirasynyň mirasdüşeri; ol dünýäniň iň uzyn eposy «Manasda» ebedileşdirilen. Keçe şyrdaklar, ak kalpak we bürgüt awy milli nyşanlardyr.</p>",
  ),
  cuisineTitle: L("Kyrgyz Cuisine", "Кыргызская кухня", "Gyrgyz aşhanasy"),
  cuisine: L(
    "<p>Beshbarmak and laghman are staples, alongside dymdama stew and oromo steamed rolls. Out on the jailoo, travellers are welcomed with kymyz (fermented mare's milk) and fresh kurut cheese balls.</p>",
    "<p>Бешбармак и лагман — основа рациона, наряду с дымдамой и оромо. На джайлоо путников встречают кумысом (кобыльим молоком) и свежими шариками курта.</p>",
    "<p>Beşbarmak we lagman esasy tagamlar, dymdama we oromo bilen birlikde. Ýaýlada syýahatçylar gymyz we kurt bilen garşylanýar.</p>",
  ),
  cuisineImages: [
    {
      src: "/Cards/kyrgyzBeshbarmak.webp",
      caption: L("Beshbarmak", "Бешбармак", "Beşbarmak"),
    },
    {
      src: "/Cards/kuurdak.jpg",
      caption: L("Kuurdak", "Куурдак", "Kuurdak"),
    },
  ],
  visa: L(
    "<p>Kyrgyzstan has one of the region's most open visa policies, with <strong>visa-free entry</strong> (up to 60 days) for citizens of many countries and an easy e-visa for others. It is an ideal base for a wider Central Asia trip.</p>",
    "<p>Кыргызстан проводит одну из самых открытых визовых политик региона: <strong>безвизовый въезд</strong> (до 60 дней) для граждан многих стран и простая электронная виза для остальных. Это идеальная база для большого путешествия по Центральной Азии.</p>",
    "<p>Gyrgyzystan sebitiň iň açyk wiza syýasatlarynyň birine eýedir: köp ýurduň raýatlary üçin <strong>wizasyz giriş</strong> (60 güne çenli) we beýlekiler üçin aňsat e-wiza.</p>",
  ),
});

// ───────────────────────── Tajikistan ─────────────────────────

const tajikistan = buildDestination({
  slug: "tajikistan",
  name: L("Tajikistan", "Таджикистан", "Täjigistan"),
  heroImage: "/Cards/tj.jpg",
  intro: L(
    "Tajikistan is the rooftop of Central Asia, dominated by the soaring Pamir Mountains. The legendary Pamir Highway, remote mountain villages and turquoise lakes draw adventurers seeking one of the world's last great wildernesses.",
    "Таджикистан — крыша Центральной Азии, над которой возвышаются Памирские горы. Легендарный Памирский тракт, удалённые горные кишлаки и бирюзовые озёра притягивают искателей приключений, ищущих один из последних великих диких уголков планеты.",
    "Täjigistan — Merkezi Aziýanyň üçeki, beýik Pamir daglary bilen tanalýar. Rowaýata öwrülen Pamir ýoly, alysdaky dag obalary we firuza köller başdan geçirijileri özüne çekýär.",
  ),
  overview: L(
    "<p>More than 90% of Tajikistan is mountainous, and half lies above 3,000 metres. The capital Dushanbe is a green, relaxed city, while the Pamirs — the 'Roof of the World' — offer some of the most remote and dramatic scenery on Earth.</p>",
    "<p>Более 90% территории Таджикистана — горы, а половина страны лежит выше 3000 метров. Столица Душанбе — зелёный, неспешный город, а Памир — «Крыша мира» — дарит одни из самых удалённых и впечатляющих пейзажей на Земле.</p>",
    "<p>Täjigistanyň 90%-den gowragy daglyk, ýarysy 3000 metrden ýokarda ýerleşýär. Paýtagt Duşenbe ýaşyl şäher, Pamir bolsa — «Dünýäniň üçegi» — iň ajaýyp görnüşleri hödürleýär.</p>",
  ),

  flights: L(
    "<p>Dushanbe International Airport links Tajikistan with Istanbul, Dubai, Almaty and Moscow. Domestic flights reach Khujand and, weather permitting, the Pamir town of Khorog.</p>",
    "<p>Международный аэропорт Душанбе связывает Таджикистан со Стамбулом, Дубаем, Алматы и Москвой. Внутренние рейсы летают в Худжанд и, при благоприятной погоде, в памирский город Хорог.</p>",
    "<p>Duşenbe halkara howa menzili Täjigistany Stambul, Dubaý, Almaty we Moskwa bilen birleşdirýär. Içerki gatnawlar Hujanda we howa amatly bolsa Horoga barýar.</p>",
  ),
  safety: L(
    "<p>Tajikistan is safe and hospitable, though the remote Pamir region requires careful planning, a GBAO permit and a reliable vehicle. Travelling with a local guide is strongly recommended for the high mountains.</p>",
    "<p>Таджикистан безопасен и гостеприимен, однако удалённый Памир требует тщательного планирования, разрешения ГБАО и надёжного транспорта. Для высокогорья настоятельно рекомендуется путешествие с местным гидом.</p>",
    "<p>Täjigistan howpsuz we myhmansöýer, ýöne alysdaky Pamir sebiti üns bilen meýilleşdirmegi, GBAO rugsadyny we ygtybarly ulagy talap edýär. Belent daglar üçin ýerli gollanma maslahat berilýär.</p>",
  ),
  traditions: L(
    "<p>Tajiks are the Persian-speaking people of Central Asia, heirs to a rich literary heritage from poets like Rudaki and Ferdowsi. Atlas silk, embroidery and the soulful Shashmaqam music are cultural treasures.</p>",
    "<p>Таджики — персоязычный народ Центральной Азии, наследники богатого литературного наследия таких поэтов, как Рудаки и Фирдоуси. Шёлк атлас, вышивка и проникновенная музыка шашмаком — культурные сокровища.</p>",
    "<p>Täjikler Merkezi Aziýanyň pars dilli halky, Rudaki we Firdöwsi ýaly şahyrlaryň baý edebi mirasynyň mirasdüşeri. Atlas ýüpegi, keşde we Şaşmakom sazy medeni hazynalardyr.</p>",
  ),
  cuisineTitle: L("Tajik Cuisine", "Таджикская кухня", "Täjik aşhanasy"),
  cuisine: L(
    "<p>Qurutob — layered flatbread with yoghurt and vegetables — is the national dish. Plov, shashlik, sambusa pastries and fragrant non bread round out a hearty, mountain-fuelled cuisine.</p>",
    "<p>Курутоб — слоёная лепёшка с кисломолочным соусом и овощами — национальное блюдо. Плов, шашлык, самбуса и ароматные лепёшки нон дополняют сытную горную кухню.</p>",
    "<p>Kurutob — milli tagam. Palaw, şaşlyk, sambusa we hoşboý non baý dag aşhanasyny tamamlaýar.</p>",
  ),
  cuisineImages: [
    {
      src: "/Cards/kurutob.webp",
      caption: L("Qurutob", "Курутоб", "Kurutob"),
    },
    {
      src: "/Cards/obi-non.jpg",
      caption: L(
        "Tajik Flatbread (Obi Non)",
        "Лепешки таджикские (Оби Нон)",
        "Täjik çöregi (Obi non)",
      ),
    },
  ],
  visa: L(
    "<p>Tajikistan offers a convenient <strong>e-visa</strong> to most nationalities, with an optional GBAO permit (added online) required for travel in the Pamir region. Sayoda Travel arranges permits and logistics for Pamir expeditions.</p>",
    "<p>Таджикистан предоставляет удобную <strong>электронную визу</strong> гражданам большинства стран, с дополнительным разрешением ГБАО (оформляется онлайн), необходимым для поездок по Памиру. Sayoda Travel оформляет разрешения и логистику для памирских экспедиций.</p>",
    "<p>Täjigistan köp ýurduň raýatlaryna amatly <strong>e-wizany</strong> hödürleýär; Pamir sebiti üçin GBAO rugsady (onlaýn goşulýar) gerek. Sayoda Travel Pamir saparlary üçin rugsatlary taýýarlaýar.</p>",
  ),
});

export const destinations: Destination[] = [
  turkmenistan,
  uzbekistan,
  kazakhstan,
  kyrgyzstan,
  tajikistan,
];

export const getDestination = (slug: string): Destination | undefined =>
  destinations.find((d) => d.slug === slug);

/**
 * Match a free-text title (e.g. a slider card title in any language) to a
 * destination by comparing it against the localized country names and slug.
 * Returns the destination whose name is contained in / contains the title.
 */
export const findDestinationByName = (
  ...titles: (string | undefined)[]
): Destination | undefined => {
  for (const raw of titles) {
    const name = raw?.trim().toLowerCase();
    if (!name) continue;
    const found = destinations.find((d) => {
      const candidates = [d.slug, ...Object.values(d.name)].map((v) =>
        v.toLowerCase(),
      );
      return candidates.some((c) => name.includes(c) || c.includes(name));
    });
    if (found) return found;
  }
  return undefined;
};

export const localize = (value: Localized, locale: string): string =>
  value[locale as DestLocale] ?? value.en;
