import { Metadata } from 'next';
import ProcessClient from './ProcessClient';

export const metadata: Metadata = {
  title: 'The Engineering Blueprint | AM LABS',
  description:
    'From first conversation and NDA protection to architecture, milestone delivery, testing, and continuous support — explore the  engineering blueprint behind AM LABS.',
  openGraph: {
    title: 'The Engineering Blueprint | AM LABS',
    description:
      'A clear, 13-step software development workflow engineered for transparency, velocity, and direct communication.',
  },
};

export default function ProcessPage() {
  return <ProcessClient />;
}
