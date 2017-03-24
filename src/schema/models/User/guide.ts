interface ILocationDocument {
  _id: string;
  name: string;
};

const Location  = {
  _id: String,
  name: String,
};

interface ILanguageDocument {
  _id: string;
  name: string;
};

const Language  = {
  _id: String,
  name: String,
};

interface IGuideDetailDocument {
  locations: ILocationDocument[];
  languages: ILanguageDocument[];
};

const GuideDetail = {
  locations: [Location],
  languages: [Language],
};

export { ILocationDocument, Location, ILanguageDocument, Language, IGuideDetailDocument, GuideDetail };
