import { Font } from '@react-pdf/renderer';
import NoToSansJPRegular from './NotoSansJP-Regular.otf';
import GenShinGothicMnospaceRegular from 'src/fonts/GenShinGothicMnospaceRegular.ttf';
import GenShinGothicMonospaceBold from 'src/fonts/GenShinGothicMonospaceBold.ttf';

Font.register({
  family: 'NoToSansJPRegular',
  fonts: [{ src: NoToSansJPRegular }]
});

Font.register({
  family: 'GenShinGothicMnospaceRegular',
  fonts: [{ src: GenShinGothicMnospaceRegular }]
});

Font.register({
  family: 'GenShinGothicMonospaceBold',
  fonts: [{ src: GenShinGothicMonospaceBold }]
});

const Fonts = {
  NoToSansJPRegular: 'NoToSansJPRegular',
  GenShinGothicMnospaceRegular: 'GenShinGothicMnospaceRegular',
  GenShinGothicMonospaceBold: 'GenShinGothicMonospaceBold'
};

export default Fonts;
