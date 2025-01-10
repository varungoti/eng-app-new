import React from 'react';
import { ContentViewNew } from '../../components/content/ContentViewNew';

interface ContentViewProps {
  mode?: 'view' | 'edit';
}

const ContentView: React.FC<ContentViewProps> = ({ mode = 'view' }) => {
  return <ContentViewNew mode={mode} />;
};

export default ContentView;