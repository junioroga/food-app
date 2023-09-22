import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { heightPercentageToDP as hp} from 'react-native-responsive-screen'
import MasonryList from '@react-native-seoul/masonry-list'
import Animated, { FadeInDown } from 'react-native-reanimated'
import Loading from './Loading'
import Image from './Image'
import { useNavigation } from '@react-navigation/native'

export default function Recipes({ categories, recipes }) {
  const navigation = useNavigation();

  return (
    <View className="mx-4 space-y-3">
      <Text 
        style={{ fontSize: hp(3) }}
        className="font-semibold text-neutral-600">
        Recipes
      </Text>
      <View>
        {(!categories.length || !recipes.length) ? <Loading size="large" style={{ top: hp(15) }} /> : 
          (
            <MasonryList
              data={recipes}
              keyExtractor={(item) => item.idMeal}
              numColumns={2}
              showsVerticalScrollIndicator={false}
              renderItem={({ item, i }) => <RecipeCard item={item} index={i} navigation={navigation} />}
            />
          )
        }
      </View>
    </View>
  )
}

const RecipeCard = ({ item, index, navigation }) => {
  const isEven = index % 2 === 0
  const isOdd = index % 3 === 0

  return (
    <Animated.View entering={FadeInDown.delay(index * 100).duration(600).springify().damping(12)}>
      <Pressable 
        style={{ width: '100%', paddingLeft: isEven ? 0 : 8, paddingRight: isEven ? 8 : 0 }} 
        className="flex justify-center mb-4 space-y-1"
        onPress={() => navigation.navigate('RecipeDetail', { ...item })}
      >
        <Image 
          uri={item.strMealThumb}
          style={{ width: '100%', height: isOdd ? hp(25) : hp(35), borderRadius: hp(4) }}
          className="bg-black/5"
          sharedTransitionTag={item.strMeal}
        />
        <Text 
          style={{ fontSize: hp(1.5)}}
          numberOfLines={1} 
          className="font-semibold ml-2 text-neutral-600"
        >
          {item.strMeal}
        </Text>
      </Pressable>
    </Animated.View>
  )
}