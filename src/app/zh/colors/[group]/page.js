import Page from '../../colors/[group]/page';
export { generateStaticParams, generateMetadata } from '../../colors/[group]/page';

export default function ZhColorsPage(props) {
    return <Page {...props} locale="zh" />;
}
