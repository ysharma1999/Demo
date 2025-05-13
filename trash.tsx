  {/* <View style={styles.header}>
                <IconButton
                    icon="arrow-left"
                    size={24}
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                />
            </View> */}

                                {/* <TextCmp variant='headlineSmall' color='darkText' textAlign='center' fontWeight={'700'}>Create a Profile</TextCmp> */}
            

                                // header: {
                                //     paddingHorizontal: theme.spacing(1),
                                //     paddingTop: theme.spacing(1),
                                // },
                                // backButton: {
                                //     margin: 0,
                                // },





//                                 import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   Image,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   TextInput,
//   SafeAreaView,
//   StatusBar,
//   Modal,
//   Animated,
//   Dimensions,
// } from 'react-native';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchNews } from './src/redux/newsSlice';
// import { useNavigation } from '@react-navigation/native';
// import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// type Article = {
//   id: number;
//   title: string;
//   body: string;
//   reactions: {
//     likes: number;
//     dislikes: number;
//   };
//   tags: string[];
//   userId: number;
//   views: number;
// };

// type RootState = {
//   news: {
//     articles: Article[];
//     status: 'idle' | 'loading' | 'succeeded' | 'failed';
//   };
// };

// const TechNewsApp = () => {
//   const [activeCategory, setActiveCategory] = useState<string>('All');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [filterModalVisible, setFilterModalVisible] = useState(false);
//   const [filterByViews, setFilterByViews] = useState<string>('All');
//   const [filterByAuthor, setFilterByAuthor] = useState<string>('All');
//   const dispatch = useDispatch();
//   const { articles, status } = useSelector((state: RootState) => state.news);
//   const navigation = useNavigation<NativeStackNavigationProp<any>>();
//   const [modalAnimation] = useState(new Animated.Value(Dimensions.get('window').height));

//   useEffect(() => {
//     dispatch(fetchNews());
//   }, [dispatch]);

//   useEffect(() => {
//     if (filterModalVisible) {
//       Animated.timing(modalAnimation, {
//         toValue: 0,
//         duration: 300,
//         useNativeDriver: true,
//       }).start();
//     } else {
//       Animated.timing(modalAnimation, {
//         toValue: Dimensions.get('window').height,
//         duration: 300,
//         useNativeDriver: true,
//       }).start();
//     }
//   }, [filterModalVisible, modalAnimation]);

//   // Get unique tags and authors
//   const allTags = articles.flatMap((article) => article.tags);
//   const uniqueTags = Array.from(new Set(allTags));
//   const categories = ['All', ...uniqueTags];
//   const uniqueAuthors = Array.from(new Set(articles.map((article) => article.userId.toString())));

//   // Filtering logic
//   const filteredArticles = articles.filter((article) => {
//     const matchesCategory = activeCategory === 'All' || article.tags.includes(activeCategory);
//     const matchesSearch = searchQuery.trim() === '' ||
//       article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       article.body.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
//     const matchesAuthor = filterByAuthor === 'All' || article.userId.toString() === filterByAuthor;
    
//     const matchesViews = filterByViews === 'All' ||
//       (filterByViews === '<100' && article.views < 100) ||
//       (filterByViews === '100-200' && article.views >= 100 && article.views <= 200) ||
//       (filterByViews === '200-300' && article.views > 200 && article.views <= 300);

//     return matchesCategory && matchesSearch && matchesAuthor && matchesViews;
//   });

//   // Recommended and list articles
//   const recommendedArticles = articles.slice(0, 5);
//   const listArticles = filteredArticles;

//   const showFilterModal = () => setFilterModalVisible(true);
//   const hideFilterModal = () => setFilterModalVisible(false);

//   return (
//     <SafeAreaView style={styles.container}>
//       {/* Header and Search */}
//       <View style={styles.header}>
//         <View style={styles.searchContainer}>
//           <Image
//             source={{ uri: 'https://cdn-icons-png.flaticon.com/512/54/54481.png' }}
//             style={styles.searchIcon}
//           />
//           <TextInput
//             style={styles.searchInput}
//             placeholder="Search..."
//             value={searchQuery}
//             onChangeText={setSearchQuery}
//             returnKeyType="search"
//             clearButtonMode="while-editing"
//           />
//         </View>
//         <TouchableOpacity style={styles.filterButton} onPress={showFilterModal}>
//           <Image
//             source={{ uri: 'https://cdn-icons-png.flaticon.com/512/107/107799.png' }}
//             style={styles.filterIcon}
//           />
//         </TouchableOpacity>
//       </View>

//       {/* Content */}
//       <ScrollView showsVerticalScrollIndicator={false}>
//         {searchQuery.trim() === '' && (
//           <>
//             <Text style={styles.sectionTitle}>Recommended</Text>
//             <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.recommendedScrollView}>
//               {recommendedArticles.map((article) => (
//                 <View key={article.id} style={styles.recommendedCardWrapper}>
//                   <View style={styles.recommendedCard}>
//                     <Image
//                       source={{ uri: 'https://www.taxmann.com/post/wp-content/uploads/2022/08/1.-Dummy-Articleship-in-CA-%E2%80%93-Is-it-Advisable.jpg' }}
//                       style={styles.recommendedImage}
//                     />
//                     <View style={styles.categoryTag}>
//                       <Text style={styles.categoryText}>{article.tags[0] || 'Uncategorized'}</Text>
//                     </View>
//                   </View>
//                   <View style={styles.recommendedContent}>
//                     <Text style={styles.recommendedTitle}>{article.title}</Text>
//                     <View style={styles.authorContainer}>
//                       <Text style={styles.authorText}>By User: {article.userId}</Text>
//                       <Text style={styles.dateText}>{article.views} views</Text>
//                     </View>
//                   </View>
//                 </View>
//               ))}
//             </ScrollView>
//           </>
//         )}

//         {/* Categories */}
//         <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScrollView}>
//           {categories.map((category) => (
//             <TouchableOpacity
//               key={category}
//               style={[styles.categoryTab, activeCategory === category && styles.activeCategory]}
//               onPress={() => setActiveCategory(category)}
//             >
//               <Text style={[styles.categoryTabText, activeCategory === category && styles.activeCategoryText]}>
//                 {category}
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </ScrollView>

//         {/* Article List */}
//         <View style={styles.articleList}>
//           {listArticles.length > 0 ? (
//             listArticles.map((article) => (
//               <TouchableOpacity 
//                 key={article.id} 
//                 style={styles.articleItem} 
//                 onPress={() => navigation.navigate('ArticleDetail', { articleId: article.id })}
//               >
//                 <Image
//                   source={{ uri: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-05-11%20at%209.32.55%E2%80%AFPM-7UFhgjwFIgWHn1Avlp8H0caopt18zc.png' }}
//                   style={styles.articleThumbnail}
//                 />
//                 <View style={styles.articleDetails}>
//                   <View style={styles.articleMeta}>
//                     <Text style={styles.articleCategory}>{article.tags[0] || 'Uncategorized'}</Text>
//                     <Text style={styles.articleDate}>{article.views} views</Text>
//                   </View>
//                   <Text style={styles.articleTitle}>{article.title}</Text>
//                 </View>
//               </TouchableOpacity>
//             ))
//           ) : (
//             <View style={styles.noResultsContainer}>
//               <Text style={styles.noResultsText}>No articles found for "{searchQuery}"</Text>
//               <TouchableOpacity style={styles.clearSearchButton} onPress={() => setSearchQuery('')}>
//                 <Text style={styles.clearSearchText}>Clear Search</Text>
//               </TouchableOpacity>
//             </View>
//           )}
//         </View>
//       </ScrollView>

//       {/* Filter Modal */}
//       <Modal transparent visible={filterModalVisible} animationType="none" onRequestClose={hideFilterModal}>
//         <View style={styles.modalOverlay}>
//           <Animated.View style={[styles.modalContainer, { transform: [{ translateY: modalAnimation }] }]}>
//             <View style={styles.modalHeader}>
//               <Text style={styles.modalTitle}>Filter By</Text>
//               <TouchableOpacity onPress={hideFilterModal} style={styles.closeButton}>
//                 <Text style={styles.closeButtonText}>Close</Text>
//               </TouchableOpacity>
//             </View>

//             <ScrollView style={styles.filterOptions}>
//               {/* Views Filter */}
//               <View style={styles.filterSection}>
//                 <Text style={styles.filterSectionTitle}>Views</Text>
//                 <View style={styles.filterButtonsRow}>
//                   {['All', '<100', '100-200', '200-300'].map((views) => (
//                     <TouchableOpacity
//                       key={views}
//                       style={[styles.filterOptionButton, filterByViews === views && styles.activeFilterButton]}
//                       onPress={() => setFilterByViews(views)}
//                     >
//                       <Text style={[styles.filterOptionText, filterByViews === views && styles.activeFilterText]}>
//                         {views}
//                       </Text>
//                     </TouchableOpacity>
//                   ))}
//                 </View>
//               </View>

//               {/* Author Filter */}
//               <View style={styles.filterSection}>
//                 <Text style={styles.filterSectionTitle}>Author</Text>
//                 <View style={styles.filterButtonsRow}>
//                   <TouchableOpacity
//                     style={[styles.filterOptionButton, filterByAuthor === 'All' && styles.activeFilterButton]}
//                     onPress={() => setFilterByAuthor('All')}
//                   >
//                     <Text style={[styles.filterOptionText, filterByAuthor === 'All' && styles.activeFilterText]}>
//                       All
//                     </Text>
//                   </TouchableOpacity>
//                   {uniqueAuthors.map((author) => (
//                     <TouchableOpacity
//                       key={author}
//                       style={[styles.filterOptionButton, filterByAuthor === author && styles.activeFilterButton]}
//                       onPress={() => setFilterByAuthor(author)}
//                     >
//                       <Text style={[styles.filterOptionText, filterByAuthor === author && styles.activeFilterText]}>
//                         User: {author}
//                       </Text>
//                     </TouchableOpacity>
//                   ))}
//                 </View>
//               </View>

//               <TouchableOpacity style={styles.applyFilterButton} onPress={hideFilterModal}>
//                 <Text style={styles.applyFilterText}>Apply Filters</Text>
//               </TouchableOpacity>
//             </ScrollView>
//           </Animated.View>
//         </View>
//       </Modal>
//     </SafeAreaView>
//   );
// };

// // Keep the same styles as in the original code
// const styles = StyleSheet.create({
//   // ... (all the style definitions from the original code)
// });

// export default TechNewsApp;



// import { enableScreens } from 'react-native-screens';
// import React, { useEffect, useState } from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
// import ErrorBoundary from 'react-native-error-boundary';
// import ErrorFallbackComponent from './src/components/error-fallback.component';
// import { PaperProvider } from 'react-native-paper';
// import { customTheme } from './src/components/theme';
// import AppNavigation from './src/navigators/app-navigation';
// import { StatusBar } from 'react-native';

// enableScreens();
// const Stack = createStackNavigator();

// const App = () => {



//   return (
//     <ErrorBoundary FallbackComponent={ErrorFallbackComponent}>
//       {/* <Provider store={store}> */}
//       <PaperProvider theme={customTheme}>
//         <NavigationContainer>
//           <StatusBar backgroundColor={'#ffffff'} barStyle="dark-content" />
//           <AppNavigation />
//         </NavigationContainer>
//       </PaperProvider>
//       {/* </Provider> */}
//     </ErrorBoundary>
//   );
// };

// export default App;
