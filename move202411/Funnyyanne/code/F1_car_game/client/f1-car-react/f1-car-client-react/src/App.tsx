import { Box, Flex, Heading } from "@radix-ui/themes";
import { HeroSection } from "./components/HeroSection";
import { BrowserRouter,Routes, Route  } from 'react-router-dom';
import { RaceManager } from "./components/RaceManager";
function App() {
  return (
    <BrowserRouter>

    <>
    <Flex
        position="sticky"
        top="0"
        px="4"
        py="2"
        justify="between"
        style={{
          borderBottom: "1px solid var(--gray-a2)",
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          backdropFilter: "blur(8px)",
          zIndex: 50,
        }}
      >
        <Box>
          <Heading>F1 Dream Team</Heading>
        </Box>
      </Flex> 
      
     {/* <HeroSection /> */}
     <Routes>
        <Route path="/" element={<HeroSection />} />
        <Route path="/race-manager" element={<RaceManager />} />
      </Routes>

     </>
     </BrowserRouter>

  );
}
export default App