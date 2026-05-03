import { Flame, Leaf, LucideIcon, Sparkles, Zap } from "lucide-react-native";
import { ImageSourcePropType } from "react-native";

export type RecipeTag = {
  label: string;
  color: string;
  Icon: LucideIcon;
};

export type Ingredient = {
  qty: string;
  name: string;
};

export type Step = {
  text: string;
  durationMin?: number;
};

export type Recipe = {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  cover: ImageSourcePropType;
  calories: number;
  durationMin: number;
  servings: number;
  difficulty: "მარტივი" | "საშუალო" | "რთული";
  category: string;
  categories: string[];
  tag?: RecipeTag;
  saved?: boolean;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  ingredients: Ingredient[];
  steps: Step[];
  dietaryTags: string[];
  rating: number;
  ratingCount: number;
};

const cover = require("@/assets/images/cheesecake.png");

export const RECIPES: Recipe[] = [
  {
    id: "cheesecake",
    title: "ჩიზქეიქი",
    description: "იტალიური დესერტი მდიდრული გემოვნებით",
    fullDescription:
      "კლასიკური იტალიური ჩიზქეიქი მსუბუქი ფსკერითა და კრემისებური თავით. იდეალურია სუფრის ბოლოს ან კავერ კერძად შაბათ-კვირას.",
    cover,
    calories: 321,
    durationMin: 45,
    servings: 8,
    difficulty: "საშუალო",
    category: "დესერტი",
    categories: ["dessert"],
    tag: { label: "პოპულარული", color: "#FF7A45", Icon: Flame },
    saved: true,
    protein: 7,
    carbs: 28,
    fat: 21,
    fiber: 1,
    rating: 4.8,
    ratingCount: 124,
    dietaryTags: ["ვეგეტარიანული"],
    ingredients: [
      { qty: "200გ", name: "კრემ-ყველი" },
      { qty: "150გ", name: "შაქარი" },
      { qty: "3 ცალი", name: "კვერცხი" },
      { qty: "200მლ", name: "ნაღები" },
      { qty: "100გ", name: "გრაჰამ ფუნთუშა" },
      { qty: "60გ", name: "კარაქი" },
      { qty: "1 ც/კ", name: "ვანილი" },
      { qty: "1 ც/კ", name: "ლიმონის ცედრა" },
    ],
    steps: [
      {
        text: "ფუნთუშა დააფშვნი და აურიე გამდნარ კარაყთან. ჩაჭიმე ფორმაში ფსკერად.",
        durationMin: 5,
      },
      {
        text: "კრემ-ყველი ააგრძნობე ოთახის ტემპერატურამდე და დაუმატე შაქარი. ააქვითე გლუვ მასამდე.",
        durationMin: 5,
      },
      {
        text: "ერთი-ერთი ჩაამატე კვერცხი, ყოველი ერთის შემდეგ ააქვითე.",
        durationMin: 5,
      },
      {
        text: "დაამატე ნაღები, ვანილი და ლიმონის ცედრა. აურიე ნაზად.",
        durationMin: 3,
      },
      {
        text: "მასა დაასხი ფორმაში და გამოაცხვე 160°C-ზე 45 წუთი.",
        durationMin: 45,
      },
      {
        text: "გამოცხობის შემდეგ გააცივე ოთახის ტემპერატურაზე, შემდეგ მაცივარში 4 საათი მაინც.",
      },
    ],
  },
  {
    id: "avocado-toast",
    title: "ავოკადო ტოსტი",
    description: "მსუბუქი საუზმე ცილით და ჯანსაღი ცხიმებით",
    fullDescription:
      "10 წუთიანი საუზმე, რომელიც აერთიანებს ცილას, რთულ ნახშირწყლებს და ჯანსაღ მონოუჯერი ცხიმებს. იდეალურია დატვირთული დილისთვის.",
    cover,
    calories: 280,
    durationMin: 10,
    servings: 1,
    difficulty: "მარტივი",
    category: "საუზმე",
    categories: ["breakfast", "vegan", "quick"],
    tag: { label: "ვეგ", color: "#34A867", Icon: Leaf },
    protein: 9,
    carbs: 30,
    fat: 16,
    fiber: 8,
    rating: 4.6,
    ratingCount: 87,
    dietaryTags: ["ვეგანური", "მაღალი ბოჭკოვანი"],
    ingredients: [
      { qty: "2 ნაჭერი", name: "მთლიანი მარცვლის პური" },
      { qty: "1 ცალი", name: "ავოკადო" },
      { qty: "1/2", name: "ლიმონი" },
      { qty: "მცირე", name: "მარილი" },
      { qty: "მცირე", name: "შავი პილპილი" },
      { qty: "1 ც/კ", name: "ჩილის ფანტელი (სურვილისამებრ)" },
    ],
    steps: [
      { text: "პური მოაშუშე ტოსტერში ოქროსფრამდე.", durationMin: 3 },
      {
        text: "ავოკადო გაჭერი შუაზე, ამოიღე გული და ჩანგლით დაჭყლიტე.",
        durationMin: 2,
      },
      {
        text: "დაამატე ლიმონის წვენი, მარილი და შავი პილპილი. აურიე.",
        durationMin: 1,
      },
      {
        text: "დატანე პურზე და დაამატე ჩილის ფანტელი თუ გიყვარს ცხარე.",
        durationMin: 2,
      },
    ],
  },
  {
    id: "chicken-salad",
    title: "ქათმის სალათი",
    description: "მაღალი ცილის წყარო ქინოვით და ბოსტნეულით",
    fullDescription:
      "მკვებავი სალათი, რომელიც გავსებს მუცელს დიდი ხნით. იდეალურია სამუშაო ლანჩისთვის ან ვარჯიშის შემდეგ.",
    cover,
    calories: 420,
    durationMin: 25,
    servings: 2,
    difficulty: "მარტივი",
    category: "სადილი",
    categories: ["lunch"],
    tag: { label: "მაღალი ცილა", color: "#7C5CFF", Icon: Zap },
    protein: 38,
    carbs: 28,
    fat: 16,
    fiber: 6,
    rating: 4.7,
    ratingCount: 56,
    dietaryTags: ["მაღალი ცილა", "გლუტენ-თავისუფალი"],
    ingredients: [
      { qty: "200გ", name: "ქათმის მკერდი" },
      { qty: "100გ", name: "ქინოა" },
      { qty: "50გ", name: "შერეული მწვანილი" },
      { qty: "1 ცალი", name: "კიტრი" },
      { qty: "10 ცალი", name: "ალუბლის პომიდორი" },
      { qty: "30გ", name: "ფეტა" },
      { qty: "2 ც/კ", name: "ზეითუნის ზეთი" },
      { qty: "1/2", name: "ლიმონი" },
    ],
    steps: [
      { text: "ქინოა მოხარშე 12-15 წუთი დამარილებულ წყალში.", durationMin: 15 },
      {
        text: "ქათმის მკერდი გრილზე ან ტაფაზე მოშუშე ორივე მხარეს, თითო 5-6 წთ.",
        durationMin: 12,
      },
      {
        text: "ბოსტნეული დაჭერი მცირე ნაჭრებად. ფეტა დაანაწევრე.",
        durationMin: 5,
      },
      {
        text: "ყველაფერი ერთად აურიე და მოასხი ზეითუნის ზეთი + ლიმონის წვენი.",
        durationMin: 2,
      },
    ],
  },
  {
    id: "salmon-veg",
    title: "ორაგული ბოსტნეულით",
    description: "ფურნეში გამომცხვარი ორაგული ლიმონითა და მწვანილით",
    fullDescription:
      "ერთი-ფირფიტიანი ვახშამი ომეგა-3-ით მდიდარი ორაგულით და სეზონური ბოსტნეულით. მინიმუმი ჭურჭელი, მაქსიმუმი გემო.",
    cover,
    calories: 510,
    durationMin: 30,
    servings: 2,
    difficulty: "საშუალო",
    category: "ვახშამი",
    categories: ["dinner"],
    tag: { label: "ომეგა-3", color: "#3FA9F5", Icon: Sparkles },
    protein: 42,
    carbs: 22,
    fat: 28,
    fiber: 5,
    rating: 4.9,
    ratingCount: 142,
    dietaryTags: ["მაღალი ცილა", "გლუტენ-თავისუფალი"],
    ingredients: [
      { qty: "2 ფილე", name: "ორაგული" },
      { qty: "200გ", name: "ბროკოლი" },
      { qty: "200გ", name: "მცირე კარტოფილი" },
      { qty: "1 ცალი", name: "ლიმონი" },
      { qty: "3 ც/კ", name: "ზეითუნის ზეთი" },
      { qty: "მცირე", name: "ნიორი (2 კბილი)" },
      { qty: "მცირე", name: "ცაცხვი" },
    ],
    steps: [
      {
        text: "ღუმელი გათბე 200°C-ზე. კარტოფილი დაჭერი ნაჭრებად.",
        durationMin: 5,
      },
      {
        text: "კარტოფილი ჩადე ფურნეში 15 წუთით ზეთთან და მარილთან.",
        durationMin: 15,
      },
      {
        text: "დაუმატე ბროკოლი და ორაგული. მოაყარე ცაცხვი, ნიორი, ლიმონი.",
        durationMin: 2,
      },
      {
        text: "გამოაცხვე კიდევ 12-15 წუთი ორაგული მზად რომ იყოს.",
        durationMin: 13,
      },
    ],
  },
  {
    id: "oatmeal-berries",
    title: "შვრიის ფაფა კენკრით",
    description: "ნელად მონელებადი ნახშირწყლები და ანტიოქსიდანტები",
    fullDescription:
      "თბილი, ნუღბრიანი ფაფა, რომელიც გაძლევს ენერგიას მთელი დილის განმავლობაში. ანტიოქსიდანტებით სავსე კენკრით ნაფარი.",
    cover,
    calories: 340,
    durationMin: 8,
    servings: 1,
    difficulty: "მარტივი",
    category: "საუზმე",
    categories: ["breakfast", "quick", "vegan"],
    tag: { label: "სწრაფი", color: "#F5A623", Icon: Zap },
    protein: 11,
    carbs: 56,
    fat: 8,
    fiber: 9,
    rating: 4.5,
    ratingCount: 73,
    dietaryTags: ["ვეგანური", "მაღალი ბოჭკოვანი"],
    ingredients: [
      { qty: "50გ", name: "შვრია" },
      { qty: "250მლ", name: "მცენარეული რძე" },
      { qty: "1 ც/კ", name: "ჩია თესლი" },
      { qty: "100გ", name: "შერეული კენკრა" },
      { qty: "1 ც/კ", name: "თაფლი ან ნეკერჩხალი" },
      { qty: "10გ", name: "ნუშის ნაჭრები" },
    ],
    steps: [
      {
        text: "შვრია და რძე დადგი ცეცხლზე. მოხარშე 5 წუთი მუდმივად აურიე.",
        durationMin: 5,
      },
      { text: "გადმოდგი და დაამატე ჩია თესლი.", durationMin: 1 },
      {
        text: "გადაასხი თეფშზე და მოაყარე კენკრა, თაფლი და ნუში.",
        durationMin: 2,
      },
    ],
  },
  {
    id: "greek-yogurt",
    title: "ბერძნული იოგურტი",
    description: "თაფლით, ნუშით და მოცვით",
    fullDescription:
      "სწრაფი, პროტეინით სავსე საუზმე ან სნექი. 5 წუთში მზად, მთლიანი ცილის წყარო ვარჯიშის შემდეგ.",
    cover,
    calories: 220,
    durationMin: 5,
    servings: 1,
    difficulty: "მარტივი",
    category: "საუზმე",
    categories: ["breakfast", "quick"],
    tag: { label: "სწრაფი", color: "#F5A623", Icon: Zap },
    protein: 18,
    carbs: 22,
    fat: 6,
    fiber: 2,
    rating: 4.4,
    ratingCount: 41,
    dietaryTags: ["ვეგეტარიანული", "მაღალი ცილა"],
    ingredients: [
      { qty: "200გ", name: "ბერძნული იოგურტი 2%" },
      { qty: "1 ც/კ", name: "თაფლი" },
      { qty: "10გ", name: "ნუშის ნაჭრები" },
      { qty: "50გ", name: "მოცვი" },
    ],
    steps: [
      { text: "იოგურტი ჩადე თასში.", durationMin: 1 },
      { text: "ზემოდან მოაყარე მოცვი, ნუში და თაფლი.", durationMin: 2 },
    ],
  },
];

export const getRecipe = (id: string): Recipe | undefined =>
  RECIPES.find((r) => r.id === id);

export const RECIPE_CATEGORIES = [
  { key: "all", label: "ყველა" },
  { key: "breakfast", label: "საუზმე" },
  { key: "lunch", label: "სადილი" },
  { key: "dinner", label: "ვახშამი" },
  { key: "dessert", label: "დესერტი" },
  { key: "vegan", label: "ვეგეტარიანული" },
  { key: "quick", label: "სწრაფი" },
];
