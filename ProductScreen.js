import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Dimensions, Pressable, FlatList } from 'react-native';

const { width } = Dimensions.get('window');

export default function ProductScreen({ route, navigation }) {
    const { product } = route.params; // Assuming product is passed as a parameter
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleScroll = (event) => {
        const contentOffsetX = event.nativeEvent.contentOffset.x;
        const index = Math.round(contentOffsetX / width);
        setCurrentIndex(index);
    };

    const renderImage = ({ item }) => (
        <Image source={{ uri: item }} style={styles.image} />
    );

    return (
        <ScrollView>
            <View style={styles.container}>
                <FlatList
                    data={product.productImages} // Adjusted to match your data structure
                    renderItem={renderImage}
                    keyExtractor={(item, index) => index.toString()}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    pagingEnabled
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                />
                <View style={styles.dotContainer}>
                    {product.productImages.map((_, index) => (
                        <View
                            key={index}
                            style={[styles.dot, { opacity: index === currentIndex ? 1 : 0.3 }]}
                        />
                    ))}
                </View>

                <Text style={styles.h1}>{product.productTitle}</Text>
                <Text style={styles.desc}>{product.productDescription}</Text>
                <Text style={[styles.desc, { color: 'green' }]}>
                    Pricing: ₹ {product.productPrice}/{product.priceUnit}
                </Text>
                {product.minOrder ? (
                    <Text style={[styles.desc, { color: 'blue' }]}>
                        Minimum Order: {product.minOrder} {product.priceUnit}
                    </Text>
                ) : null}

                <Pressable style={styles.button} onPress={() => navigation.navigate('QuotationScreen', { product })}>
                    <Text style={{ color: '#fff', textAlign: 'center' }}>Get Quotation</Text>
                </Pressable>

                <Text style={styles.desc}>{product.productSpecification}</Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    h1: {
        fontSize: 26,
        fontWeight: 'bold',
        marginVertical: 16,
    },
    desc: {
        fontSize: 16,
        color: '#262626',
        marginVertical: 4,
    },
    image: {
        width: width - 20,
        height: width - 20,
        borderRadius: 10, // Optional: for rounded corners
    },
    button: {
        backgroundColor: 'teal',
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginTop: 10,
        width: width - 40,
    },
    dotContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'teal',
        marginHorizontal: 5,
    },
});
