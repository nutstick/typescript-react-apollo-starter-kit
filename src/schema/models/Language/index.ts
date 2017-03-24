import { Collection, Index, Instance, Model, ObjectID, Property } from 'iridium';

interface ILanguageDocument {
  _id?: string;
  language: string;
};

@Index({ language: 1 })
@Collection('language')
class Language extends Instance<ILanguageDocument, Language> implements ILanguageDocument {
  @ObjectID
  _id: string;
  @Property(/^.+$/, true)
  language: string;
}

export default Language;

