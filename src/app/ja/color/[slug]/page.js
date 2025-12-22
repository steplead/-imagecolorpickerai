import ColorDetail from '../../color/[slug]/page';
export { generateStaticParams, generateMetadata } from '../../color/[slug]/page';

export default function JaColorPage(props) {
    return <ColorDetail {...props} locale="ja" />;
}
