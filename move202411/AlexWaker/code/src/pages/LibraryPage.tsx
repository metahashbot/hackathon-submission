import React from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Header from './Header';
import { Box } from '@radix-ui/themes';

const LibraryContent: React.FC = () => {
  const { image_id } = useParams();  //从url中取出一个叫 id 的参数
  // const { issue_id } = useParams();
  const images = [
    {
      id: 'john-von-neumann',
      title: '计算机科学',
      description: 'A mathematician and physicist known for game theory and computer science.',
      url: 'https://pic.imgdb.cn/item/6756fd88d0e0a243d4e0b50d.webp',
    },
    {
      id: 'isaac-newton',
      title: '数学&物理学',
      description: 'A physicist and mathematician who developed the laws of motion.',
      url: 'https://pic.imgdb.cn/item/6756fd87d0e0a243d4e0b50c.webp',
    },
    {
      id: 'victor-hugo',
      title: '文学',
      description: 'A French poet and novelist best known for Les Misérables.',
      url: 'https://pic.imgdb.cn/item/6756fd87d0e0a243d4e0b50b.webp',
    },
    {
      id: 'thomas-edison',
      title: '发明&工程学',
      description: 'An inventor and businessman known for the light bulb and phonograph.',
      url: 'https://pic.imgdb.cn/item/6756fd76d0e0a243d4e0b506.webp',
    },
    {
      id: 'leonardo-da-vinci',
      title: '艺术',
      description: 'An Italian artist, scientist, and polymath known for his paintings and inventions.',
      url: 'https://pic.imgdb.cn/item/6756fd75d0e0a243d4e0b505.webp',
    },
    {
      id: 'sigmund-freud',
      title: '心理学',
      description: 'An Austrian neurologist and the founder of psychoanalysis.',
      url: 'https://pic.imgdb.cn/item/6756fd74d0e0a243d4e0b504.webp',
    },
    {
      id: 'alexander-the-great',
      title: '政治&社会学',
      description: 'A Macedonian king known for his military conquests and the spread of Hellenistic culture.',
      url: 'https://pic.imgdb.cn/item/6756fd73d0e0a243d4e0b503.webp',
    },
    {
      id: 'adam-smith',
      title: '金融&经济学',
      description: 'A Scottish economist and philosopher known for his work on the Boxision of labor.',
      url: 'https://pic.imgdb.cn/item/6756fd73d0e0a243d4e0b502.webp',
    },
  ];

  const image = images.find((img) => img.id === image_id) || {
    title: 'Unknown',
    description: 'No information available.',
    url: '',
  };

  return (
    <Box className="allLibraryPage">
      <Header />
      <Box style={{ display: 'flex', flexDirection: 'row', width: '100%', height: '100vh', padding: '20px', boxSizing: 'border-box' }}>
        {/* A 部分：大图片 */}
        <Box style={{ flex: 1, marginRight: '20px' }}>
          <img 
            src={image.url} 
            alt="Large Display" 
            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }}
          />
        </Box>

        {/* B 和 C 部分 */}
        <Box style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* B 部分：展示一段话 */}
          <Box style={{ flex: 1, backgroundColor: '#000000', padding: '20px', borderRadius: '10px', overflow: 'auto' }}>
            <h2>{image.title}</h2>
            <p>
              {image.description}
            </p>
          </Box>

          {/* C 部分：可滚动的小窗口 */}
          <Box style={{ flex: 1.5, backgroundColor: '#000000', padding: '20px', border: '1px solid #ccc', borderRadius: '10px', overflowY: 'scroll' }}>
            <h3>相关内容</h3>
            <ul style={{ listStyleType: 'none', padding: '0', margin: '0' }}>
              {Array.from({ length: 20 }).map((_, index) => (
                <li key={index} style={{ marginBottom: '10px', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}>
                  <Link to={`/${image_id}/${index + 1}`}>相关条目 {index + 1}</Link>
                </li>
              ))}
            </ul>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default LibraryContent;

