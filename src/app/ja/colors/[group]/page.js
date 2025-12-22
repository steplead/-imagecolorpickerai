import Page from '../../colors/[group]/page';
export { generateStaticParams, generateMetadata } from '../../colors/[group]/page';

export default function JaColorsPage(props) {
    return <Page {...props} locale="ja" />;
}
