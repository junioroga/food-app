import { View, ScrollView, TouchableOpacity, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import Image from '../components/Image'
import { heightPercentageToDP as hp, widthPercentageToDP as wp  } from 'react-native-responsive-screen'
import { StatusBar } from 'expo-status-bar'
import { ChevronLeftIcon, ClockIcon, FireIcon } from 'react-native-heroicons/outline'
import { HeartIcon, Square3Stack3DIcon, UsersIcon } from 'react-native-heroicons/solid'
import { useNavigation } from '@react-navigation/native'
import axios from 'axios'
import Loading from '../components/Loading'
import YoutubeIframe from 'react-native-youtube-iframe'
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated'

export default function RecipeDetailsScreen(props) {
  const item = props.route.params
  const [isFavourite, setIsFavourite] = useState(false)
  const [recipe, setRecipe] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigation = useNavigation()

  useEffect(() => {
    getRecipeData(item.idMeal)
  }, [])

  const getRecipeData = async (id) => {
    try {
      const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)

      if (response?.data) {
        setRecipe(response.data.meals[0])
        setLoading(false)
      }
    } catch (error) {
      console.error(error.message)
    }
  }

  const ingredientsIndexes = (recipe) => {
    if (!recipe) return []

    const indexes = []

    for(let i = 1; i <= 20; i++) {
      if (recipe['strIngredient' + i]) {
        indexes.push(i)
      }
    }

    return indexes
  }

  const getYoutubeVideoId = (url) => {
    const regex = /[?&]v=([^&]+)/
    const match = url.match(regex)

    if (match && match[1]) {
      return match[1]
    }

    return null;
  }

  return (
    <ScrollView 
      className="bg-white flex-1"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 30 }}   
    >
      <StatusBar style="light" />

      {/* recipe image */}
      <View className="flex-row justify-center">
        <Image 
          uri={item.strMealThumb} 
          style={{ 
            width: wp(98), 
            height: hp(50), 
            borderRadius: hp(5.5),
            marginTop: hp(0.5)
          }}
          sharedTransitionTag={item.strMeal} 
        />
      </View>

      {/* back button */}
      <Animated.View entering={FadeIn.delay(200).duration(1000)} style={{ paddingTop: hp(6) }} className="w-full absolute flex-row justify-between items-center">
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          className="p-2 rounded-full ml-5 bg-white"
        >
          <ChevronLeftIcon size={hp(3.5)} strokeWidth={4.5} color="#fbbf24" />
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => setIsFavourite((old) => !old)}
          className="p-2 rounded-full mr-5 bg-white"
        >
          <HeartIcon size={hp(3.5)} strokeWidth={4.5} color={isFavourite ? 'red' : 'gray'} />
        </TouchableOpacity>
      </Animated.View>

      {/* meal description */}
      {
        loading ? (
          <Loading size="large" style={{ top: hp(22) }}/>
        ) : (
          <View className="px-4 flex justify-between space-y-4 pt-8">
            {/* name and area */}
            <Animated.View entering={FadeInDown.duration(700).springify().damping(12)} className="space-y-2">
              <Text style={{ fontSize: hp(3) }} className="font-bold flex-1 text-neutral-700">
                {recipe?.strMeal}
              </Text>
              <Text style={{ fontSize: hp(2) }} className="font-medium flex-1 text-neutral-500">
                {recipe?.strArea}
              </Text>
            </Animated.View>

            {/* misc */}
            <Animated.View entering={FadeInDown.delay(100).duration(700).springify().damping(12)} className="flex-row justify-around">
              <View className="flex rounded-full bg-amber-300 p-2">
                <View 
                  style={{ height: hp(6.5), width: hp(6.5) }}
                  className="bg-white rounded-full flex items-center justify-center"
                >
                  <ClockIcon size={hp(4)} strokeWidth={2.5} color="#525252" />

                </View>
                <View className="flex items-center py-2 space-y-1">
                  <Text style={{ fontSize: hp(2) }} className="font-bold text-neutral-700">35</Text>
                  <Text style={{ fontSize: hp(1.3) }} className="font-bold text-neutral-700">Mins</Text>

                </View>
              </View>
              <View className="flex rounded-full bg-amber-300 p-2">
                <View 
                  style={{ height: hp(6.5), width: hp(6.5) }}
                  className="bg-white rounded-full flex items-center justify-center"
                >
                  <UsersIcon size={hp(4)} strokeWidth={2.5} color="#525252" />

                </View>
                <View className="flex items-center py-2 space-y-1">
                  <Text style={{ fontSize: hp(2) }} className="font-bold text-neutral-700">3</Text>
                  <Text style={{ fontSize: hp(1.3) }} className="font-bold text-neutral-700">Servings</Text>
                </View>
              </View>
              <View className="flex rounded-full bg-amber-300 p-2">
                <View 
                  style={{ height: hp(6.5), width: hp(6.5) }}
                  className="bg-white rounded-full flex items-center justify-center"
                >
                  <FireIcon size={hp(4)} strokeWidth={2.5} color="#525252" />

                </View>
                <View className="flex items-center py-2 space-y-1">
                  <Text style={{ fontSize: hp(2) }} className="font-bold text-neutral-700">103</Text>
                  <Text style={{ fontSize: hp(1.3) }} className="font-bold text-neutral-700">Cal</Text>
                </View>
              </View>
              <View className="flex rounded-full bg-amber-300 p-2">
                <View 
                  style={{ height: hp(6.5), width: hp(6.5) }}
                  className="bg-white rounded-full flex items-center justify-center"
                >
                  <Square3Stack3DIcon size={hp(4)} strokeWidth={2.5} color="#525252" />

                </View>
                <View className="flex items-center py-2 space-y-1">
                  <Text style={{ fontSize: hp(2) }} className="font-bold text-neutral-700"></Text>
                  <Text style={{ fontSize: hp(1.3) }} className="font-bold text-neutral-700">Easy</Text>
                </View>
              </View>
            </Animated.View>

            {/* ingredients */}
            <Animated.View entering={FadeInDown.delay(200).duration(700).springify().damping(12)} className="space-y-4">
              <Text 
                style={{ fontSize: hp(2.5)}}
                className="font-bold flex-1 text-neutral-700"
              >
                Ingredients
              </Text>
              <View className="space-y-2 ml-3">
                {
                  ingredientsIndexes(recipe).map((i) => {
                    return (
                      <View key={i} className="flex-row space-x-4">
                        <View 
                          style={{ height: hp(1.5), width: hp(1.5) }}
                          className="bg-amber-300 rounded-full"
                        />
                        <View className="flex-row space-x-2">
                          <Text style={{ fontSize: hp(1.7) }} className="font-extrabold text-neutral-700">
                            {recipe['strMeasure' + i]}
                          </Text>
                          <Text style={{ fontSize: hp(1.7) }} className="font-medium text-neutral-600">
                            {recipe['strIngredient' + i]}
                          </Text>
                        </View> 
                      </View>
                    )
                  })
                }
              </View>
            </Animated.View>

            {/* instructions */}
            <Animated.View entering={FadeInDown.delay(300).duration(700).springify().damping(12)} className="space-y-4">
              <Text 
                style={{ fontSize: hp(2.5)}}
                className="font-bold flex-1 text-neutral-700"
              >
                Instructions
              </Text>
              <Text 
                style={{ fontSize: hp(1.6) }}
                className="text-neutral-700"
              >
                {recipe?.strInstructions}
              </Text>
            </Animated.View>

            {/* recipe video */}
            {
              recipe?.strYoutube && (
                <Animated.View entering={FadeInDown.delay(400).duration(700).springify().damping(12)} className="space-y-4">
                  <Text 
                    style={{ fontSize: hp(2.5) }} 
                    className="font-bold flex-1 text-neutral-700"
                  >
                    Recipe Video
                  </Text>
                  <View>
                    <YoutubeIframe 
                      videoId={getYoutubeVideoId(recipe?.strYoutube)}
                      height={hp(30)}
                    />
                  </View>
                </Animated.View>
              )
            }

          </View>
        )
      }
    
    </ScrollView>
  )
}