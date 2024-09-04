import React, {useState} from 'react';
import Profile from './src/components/Profile';
import StoryComponent from './src/components/StoryComponent';
import {stories} from './src/helper/exportedFunction';

function App(): React.JSX.Element {
  const [insideStory, setInsideStory] = useState(false);

  function openStory() {
    setInsideStory(true);
  }

  function closeStory() {
    setInsideStory(false);
  }

  return insideStory ? (
    <StoryComponent onFinishStory={closeStory} stories={stories} />
  ) : (
    <Profile onPress={openStory} displayName="Anxhelo" outlineColor="#33ad1d" />
  );
}

export default App;
