import React, { useCallback, useEffect, useState } from "react";
import ReactDOM from "react-dom";

import { ChevronRight, ChevronLeft } from "react-feather";
import {
  animated,
  useTransition,
  useSprings,
  useSpringRef
} from "react-spring";

import styled, { ThemeProvider } from "styled-components";

import { Box, Container, Heading, Typography, Flex, theme } from "../../ui";

import "../../ui/molecules/global-styles/global.css";

import { slides } from "../slides";

const blue = theme.colors.brand;
const text100 = theme.colors.text100;
const text500 = theme.colors.text500;

const sliderHeight = 350;

const Slide = styled(animated(Flex))``;
Slide.defaultProps = {
  position: "absolute",
  justifyContent: "flex-end",
  height: sliderHeight,
  width: "100%",
  backgroundSize: "cover",
  backgroundPosition: "center center",
  backgroundRepeat: "no-repeat",
  willChange: "opacity"
};

const SlideText = styled(Flex)``;
SlideText.defaultProps = {
  flexDirection: "column",
  width: [1, null, null, 1 / 2],
  alignSelf: "flex-end",
  backgroundColor: "rgba(255, 255, 255, 0.6)",
  p: 2,
  m: [0, null, null, 2]
};

const ControlsWrap = styled(Flex)``;
ControlsWrap.defaultProps = {
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center"
};

const Control = styled(Flex)`
  cursor: pointer;
`;
Control.defaultProps = {
  background: "#c6c6c6",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "50%",
  size: [24, null, 36]
};

const Bullet = styled(animated(Control))`
  cursor: pointer;
`;
Bullet.defaultProps = {
  size: [24, null, 36],
  alignItems: "center",
  justifyContent: "center",
  mx: [1, null, 2],
  color: "text500",
  borderRadius: "50%"
};

const Arrow = styled(Control)``;
Arrow.defaultProps = {
  mx: [1, null, 6]
};

function App() {
  const [[index, dir], setIndex] = useState([0, 0]);
  const transRef = useSpringRef();

  const transitions = useTransition(index, {
    ref: transRef,
    keys: index,
    from: {
      transform: `translate3d(${dir === 1 ? 100 : -100}%,0,0) scale(0.8)`
    },
    enter: {
      transform: "translate3d(0%,0,0) scale(1)"
    },
    leave: {
      transform: `translate3d(${dir === 1 ? -100 : 100}%,0,0) scale(0.8)`
    },
    config: { duration: 600 }
  });

  useEffect(() => {
    transRef.start();
  }, [index]);

  const handleNextSlide = useCallback(
    (dir) =>
      setIndex((state) => [
        (state[0] + dir + slides.length) % slides.length,
        dir
      ]),
    []
  );

  const bulletSprings = useSprings(
    slides.length,
    slides.map((item, i) => ({
      border: "2px solid",
      borderColor: index === i ? blue : text100,
      background: index === i ? "rgba(0,0,0,0)" : "#c6c6c6",
      color: index === i ? blue : text500,
      from: {
        border: "2px solid",
        borderColor: text100,
        color: text500
      }
    }))
  );

  return (
    <ThemeProvider theme={theme}>
      <Box bg="bg100" minHeight="100vh" py={1}>
        <Container>
          <Heading textAlign="center">
            React Spring (v9) Example - useTransition
          </Heading>
          <Box height={sliderHeight + 48}>
            <Box position="relative">
              {transitions((styles, i) => (
                <Slide
                  style={styles}
                  background={`url(${slides[i].url}?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940)`}
                >
                  <SlideText>
                    <Typography fontWeight={2} fontSize={4}>
                      {slides[i].title}
                    </Typography>
                    {slides[i].text}
                  </SlideText>
                </Slide>
              ))}
              <ControlsWrap pt={sliderHeight + 8}>
                <Arrow onClick={() => handleNextSlide(-1)}>
                  <ChevronLeft />
                </Arrow>
                {bulletSprings.map((props, i) => (
                  <Flex
                    key={i}
                    onClick={() =>
                      setIndex((prevState) => [i, i > prevState[0] ? 1 : -1])
                    }
                  >
                    <Bullet style={props}>{i + 1}</Bullet>
                  </Flex>
                ))}
                <Arrow onClick={() => handleNextSlide(1)}>
                  <ChevronRight />
                </Arrow>
              </ControlsWrap>
            </Box>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
