import { Box, Container, Heading, Text, VStack, Link, Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";

const Index = () => {
  const [stories, setStories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty")
      .then(response => response.json())
      .then(data => {
        const storyIds = data.slice(0, 15);
        return Promise.all(storyIds.map(id =>
          fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`)
            .then(response => response.json())
        ));
      })
      .then(stories => {
        setStories(stories);
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Error fetching stories:", error);
        setIsLoading(false);
      });
  }, []);

  return (
    <Container maxW="container.xl" py={8}>
      <Flex direction="column" align="center" mb={10}>
        <Heading mb={4}>HackerNews Top Stories</Heading>
        <Text fontSize="lg">Read the latest top stories from HackerNews.</Text>
      </Flex>
      {isLoading ? (
        <Text>Loading...</Text>
      ) : (
        <VStack spacing={4} align="stretch">
          {stories.map(story => (
            <Box key={story.id} p={5} shadow="md" borderWidth="1px">
              <Heading fontSize="xl">{story.title}</Heading>
              <Text mt={4}>{story.by}</Text>
              <Link href={story.url} isExternal color="teal.500">Read more</Link>
            </Box>
          ))}
        </VStack>
      )}
    </Container>
  );
};

export default Index;