import { View, Text } from 'react-native'
import React from 'react'
import useSWR from 'swr'
import axios from 'axios'
import Skeleton from './Skeleton'

const fetcher = (url) => axios.get(url).then((res) => res.data)

export default function Facts() {
    const { data, isLoading, error } = useSWR('https://catfact.ninja/fact', fetcher)
  return (
    <View className="py-5 px-10">
      
        <Text className="text-start text-3xl font-medium underline decoration-[#fb7867] mb-5">
            Cat Facts
        </Text>

        {isLoading ? (
            <Skeleton />
        ) : error ? (
            <Text className="bg-gray-300 p-3 text-start text-base font-medium">Failed to fetch fact :(</Text>
        ) : (
            <View className="bg-gray-300 rounded-sm p-3">
                <Text className="text-center text-base font-medium">{data.fact}</Text>
            </View>
        )}

    </View>
  )
}