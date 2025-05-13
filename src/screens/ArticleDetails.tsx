import React, { useState, useEffect, useMemo } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    ScrollView,
    SafeAreaView,
    ActivityIndicator,
    useWindowDimensions,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchArticleById } from '../redux/newsSlice'
import { RouteProp } from '@react-navigation/native';


type Article = {
    id: number;
    title: string;
    body: string;
    reactions: {
        likes: number;
        dislikes: number;
    };
    tags: string[];
    userId: number;
    views: number;
};

type RootState = {
    news: {
        singleArticle: Article | null;
        status: 'idle' | 'loading' | 'succeeded' | 'failed';
        error: string | null;
    };
};

type ArticleDetailRouteParams = {
    articleId: number;
};

type ArticleDetailScreenProps = {
    route: RouteProp<{ params: ArticleDetailRouteParams }, 'params'>;
};

const HERO_IMAGE_URI = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdVLSeqt3Qy43CiyGdok7aq5qvtgl_eUcC3g&s';


const LoadingView = () => (
    <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
    </View>
);


const ErrorView = ({ message }: { message: string }) => (
    <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {message}</Text>
    </View>
);



const ArticleDetailScreen: React.FC<ArticleDetailScreenProps> = ({ route }) => {
    const { articleId } = route.params;
    const dispatch = useDispatch();


    const { singleArticle, status, error } = useSelector((state: RootState) => state.news);

    useEffect(() => {
        if (articleId) {
            dispatch(fetchArticleById(articleId));
        }
    }, [dispatch, articleId]);




    if (status === 'loading') {
        return <LoadingView />;
    }

    if (error) {
        return <ErrorView message={error} />;
    }

    if (!singleArticle) {
        return null;
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.container}>
                <View style={styles.heroImageContainer}>
                    <Image
                        source={{ uri: HERO_IMAGE_URI }}
                        style={styles.heroImage}
                        resizeMode="cover"
                    />
                </View>

                <View style={styles.contentContainer}>
                
                    <View style={styles.metaContainer}>
                        <View style={styles.categoryBadge}>
                            <Text style={styles.categoryText}>
                                {singleArticle.tags[0] || 'General'}
                            </Text>
                        </View>
                        <Text style={styles.dateText}>
                            {singleArticle.reactions.likes} likes • {singleArticle.reactions.dislikes} dislikes
                        </Text>
                    </View>

                    <Text style={styles.title}>{singleArticle.title}</Text>


                    <View style={styles.articleContent}>
                        <Text style={styles.paragraph}>
                            {singleArticle?.body}
                        </Text>
                    </View>

                    <Text style={styles.authorText}>
                        By User: {singleArticle.userId}
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    heroImageContainer: {
        width: '100%',
        position: 'relative',
    },
    heroImage: {
        width: '100%',
        height: 245,
    },
    contentContainer: {
        padding: 16,
    },
    metaContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        justifyContent: "space-between",
    },
    categoryBadge: {
        backgroundColor: '#f2f2f2',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 4,
        marginRight: 10,
    },
    categoryText: {
        fontSize: 12,
        fontWeight: '500',
        color: '#666',
    },
    dateText: {
        fontSize: 12,
        color: '#888',
    },
    authorText: {
        fontSize: 12,
        color: '#888',
        marginTop: 8,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#222',
        marginBottom: 16,
        lineHeight: 32,
    },
    articleContent: {
        marginBottom: 24,
    },
    paragraph: {
        fontSize: 16,
        lineHeight: 24,
        color: '#333',
        marginBottom: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        fontSize: 16,
        color: 'red',
        textAlign: 'center',
    },
});

export default ArticleDetailScreen;