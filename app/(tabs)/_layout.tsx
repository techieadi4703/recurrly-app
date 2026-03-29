import { tabs } from "@/constants/data";
import { colors, components } from "@/constants/themes";
import { Tabs } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Image, View, Animated, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const tabBar = components.tabBar;

const TabIcon = ({ focused, icon }: any) => {
  // Derive a subtle scaling bounce for the icon so it pops when active
  const scale = useRef(new Animated.Value(focused ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: focused ? 1 : 0,
      useNativeDriver: true,
      friction: 6,
      tension: 50,
    }).start();
  }, [focused]);

  const iconScale = scale.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.15],
  });

  return (
    <Animated.View
      style={{
        width: 48,
        height: 48,
        alignItems: "center",
        justifyContent: "center",
        transform: [{ scale: iconScale }],
      }}
    >
      <Image
        source={icon}
        style={{
          width: 24,
          height: 24,
          tintColor: "white",
        }}
        resizeMode="contain"
      />
    </Animated.View>
  );
};

const CustomTabBar = ({ state, descriptors, navigation }: any) => {
  const insets = useSafeAreaInsets();
  const [containerWidth, setContainerWidth] = useState(0);

  // Tracks the sliding horizontal position of the orange circle
  const translateX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (containerWidth > 0) {
      const tabWidth = containerWidth / state.routes.length;
      Animated.spring(translateX, {
        toValue: state.index * tabWidth,
        useNativeDriver: true,
        friction: 7, // Adds slight drag
        tension: 40, // Adjusts bounce strength
      }).start();
    }
  }, [state.index, containerWidth, state.routes.length]);

  return (
    <View
      onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
      style={{
        position: "absolute",
        bottom: Math.max(insets.bottom, tabBar.horizontalInset),
        left: tabBar.horizontalInset,
        right: tabBar.horizontalInset,
        height: tabBar.height,
        backgroundColor: colors.primary,
        borderRadius: tabBar.radius,
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      {/* Sliding Orange Circle */}
      {containerWidth > 0 && (
        <Animated.View
          style={{
            position: "absolute",
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: colors.accent,
            transform: [
              {
                translateX: Animated.add(
                  translateX,
                  (containerWidth / state.routes.length - 48) / 2,
                ),
              },
            ],
          }}
        />
      )}

      {/* Render the clickable tabs over the top */}
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            activeOpacity={1} // Don't dim on press, rely on custom animations
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
            }}
          >
            {options.tabBarIcon && options.tabBarIcon({ focused: isFocused })}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const TabLayout = () => {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ focused }) => (
              <TabIcon focused={focused} icon={tab.icon} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
};

export default TabLayout;
