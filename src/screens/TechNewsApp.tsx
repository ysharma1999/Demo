import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Modal,
  Dimensions,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNews, searchNews } from '../redux/newsSlice'
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

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
    articles: Article[];
    searchResults: Article[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    searchStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  };
};


type ViewsFilterOption = 'All' | '<100' | '100-200' | '200-300';
type AuthorFilterOption = string;


const VIEWS_FILTER_OPTIONS: ViewsFilterOption[] = ['All', '<100', '100-200', '200-300'];
const DEFAULT_IMAGE_URI = 'https://www.taxmann.com/post/wp-content/uploads/2022/08/1.-Dummy-Articleship-in-CA-%E2%80%93-Is-it-Advisable.jpg';


const CategoryTag = ({ category }: { category: string }) => (
  <View style={styles.categoryTag}>
    <Text style={styles.categoryText}>{category || 'Uncategorized'}</Text>
  </View>
);

const FilterButton = ({
  label,
  isActive,
  onPress
}: {
  label: string;
  isActive: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity
    style={[styles.filterOptionButton, isActive && styles.activeFilterButton]}
    onPress={onPress}
  >
    <Text style={[styles.filterOptionText, isActive && styles.activeFilterText]}>
      {label}
    </Text>
  </TouchableOpacity>
);

const RecommendedArticleCard = ({ article, onPress }: { article: Article; onPress: () => void }) => (
  <TouchableOpacity style={styles.recommendedCardWrapper} onPress={onPress}>
    <View style={styles.recommendedCard}>
      <Image
        source={{ uri: DEFAULT_IMAGE_URI }}
        style={styles.recommendedImage}
      />
      <CategoryTag category={article.tags[0]} />
    </View>
    <View style={styles.recommendedContent}>
      <Text style={styles.recommendedTitle} numberOfLines={2}>{article.title}</Text>
      <View style={styles.authorContainer}>
        <Text style={styles.authorText}>By User: {article.userId}</Text>
        <Text style={styles.dateText}>{article.views} views</Text>
      </View>
    </View>
  </TouchableOpacity>
);

const ArticleListItem = ({ article, onPress }: { article: Article; onPress: () => void }) => (
  <TouchableOpacity style={styles.articleItem} onPress={onPress}>
   
    <View style={styles.articleDetails}>
      <View style={styles.articleMeta}>
        <Text style={styles.articleCategory}>{article.tags[0] || 'Uncategorized'}</Text>
        <Text style={styles.articleDate}>{article.views} views</Text>
      </View>
      <Text style={styles.articleTitle} numberOfLines={2}>{article.title}</Text>
    </View>
  </TouchableOpacity>
);

const NoResults = ({ query, onClear }: { query: string; onClear: () => void }) => (
  <View style={styles.noResultsContainer}>
    <Text style={styles.noResultsText}>No articles found for "{query}"</Text>
    <TouchableOpacity style={styles.clearSearchButton} onPress={onClear}>
      <Text style={styles.clearSearchText}>Clear Search</Text>
    </TouchableOpacity>
  </View>
);

const TechNewsApp = () => {

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [filterByViews, setFilterByViews] = useState<ViewsFilterOption>('All');
  const [filterByAuthor, setFilterByAuthor] = useState<AuthorFilterOption>('All');


  const dispatch = useDispatch();
  const { articles, searchResults, status, searchStatus } = useSelector((state: RootState) => state.news);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();


  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchNews());
    }
  }, [dispatch, status]);
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchQuery.trim()) {
        dispatch(searchNews(searchQuery));
      } else {
        dispatch(fetchNews());
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [searchQuery, dispatch]);

  const articlesToDisplay = useMemo(() => {
    return searchQuery ? searchResults : articles;
  }, [searchQuery, articles, searchResults]);
  
  const uniqueTags = useMemo(() => {
    const allTags = articlesToDisplay.flatMap(article => article.tags);
    return ['All', ...Array.from(new Set(allTags))];
  }, [articlesToDisplay]);

  const uniqueAuthors = useMemo(() => {
    return Array.from(new Set(articlesToDisplay.map(article => article.userId.toString())));
  }, [articlesToDisplay]);

  const recommendedArticles = useMemo(() => {
    return articles.slice(0, 5);
  }, [articles]);


  const filteredArticles = useMemo(() => {
    return articlesToDisplay.filter(article => {
      const matchesAuthor = filterByAuthor === 'All' || article.userId.toString() === filterByAuthor;

      let matchesViews = true;
      if (filterByViews === '<100') {
        matchesViews = (article.views || 0) < 100;
      } else if (filterByViews === '100-200') {
        matchesViews = (article.views || 0) >= 100 && (article.views || 0) <= 200;
      } else if (filterByViews === '200-300') {
        matchesViews = (article.views || 0) > 200 && (article.views || 0) <= 300;
      }

      return matchesAuthor && matchesViews;
    });
  }, [articlesToDisplay, filterByAuthor, filterByViews]);

  const navigateToArticle = useCallback((articleId: number) => {
    navigation.navigate('ArticleDetail', { articleId });
  }, [navigation]);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  const toggleFilterModal = useCallback(() => {
    setFilterModalVisible(prevState => !prevState);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Image
            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/54/54481.png' }}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
        </View>
        <TouchableOpacity style={styles.filterButton} onPress={toggleFilterModal}>
          <Image
            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/107/107799.png' }}
            style={styles.filterIcon}
          />
        </TouchableOpacity>
      </View>


      <ScrollView showsVerticalScrollIndicator={false}>
        {searchQuery.trim() === '' && (
          <>
            <Text style={styles.sectionTitle}>Recommended</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.recommendedScrollView}>
              {recommendedArticles.map((article) => (
                <RecommendedArticleCard
                  key={`recommended-${article.id}`}
                  article={article}
                  onPress={() => navigateToArticle(article.id)}
                />
              ))}
            </ScrollView>
          </>
        )}

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScrollView}>
          {uniqueTags.map((category) => (
            <TouchableOpacity
              key={category}
              style={[styles.categoryTab, activeCategory === category && styles.activeCategory]}
              onPress={() => setActiveCategory(category)}
            >
              <Text style={[styles.categoryTabText, activeCategory === category && styles.activeCategoryText]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.articleList}>
          {filteredArticles.length > 0 ? (
            filteredArticles.map((article) => (
              <ArticleListItem
                key={`list-${article.id}`}
                article={article}
                onPress={() => navigateToArticle(article.id)}
              />
            ))
          ) : (
            <NoResults query={searchQuery} onClear={clearSearch} />
          )}
        </View>
      </ScrollView>


      <Modal transparent visible={filterModalVisible} animationType="slide" onRequestClose={toggleFilterModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter By</Text>
              <TouchableOpacity onPress={toggleFilterModal} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.filterOptions}>
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Views</Text>
                <View style={styles.filterButtonsRow}>
                  {VIEWS_FILTER_OPTIONS.map((option) => (
                    <FilterButton
                      key={option}
                      label={option}
                      isActive={filterByViews === option}
                      onPress={() => setFilterByViews(option)}
                    />
                  ))}
                </View>
              </View>


              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Author</Text>
                <View style={styles.filterButtonsRow}>
                  <FilterButton
                    label="All"
                    isActive={filterByAuthor === 'All'}
                    onPress={() => setFilterByAuthor('All')}
                  />
                  {uniqueAuthors.map((author) => (
                    <FilterButton
                      key={author}
                      label={`User: ${author}`}
                      isActive={filterByAuthor === author}
                      onPress={() => setFilterByAuthor(author)}
                    />
                  ))}
                </View>
              </View>

              <TouchableOpacity style={styles.applyFilterButton} onPress={toggleFilterModal}>
                <Text style={styles.applyFilterText}>Apply Filters</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 16,
    paddingBottom: 30,
    maxHeight: Dimensions.get('window').height * 0.7,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    color: '#007AFF',
    fontSize: 16,
  },
  filterOptions: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  filterSection: {
    marginBottom: 24,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  filterButtonsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterOptionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f2f2f2',
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  activeFilterButton: {
    backgroundColor: '#333',
    borderColor: '#333',
  },
  filterOptionText: {
    color: '#666',
    fontSize: 14,
  },
  activeFilterText: {
    color: '#fff',
  },
  applyFilterButton: {
    backgroundColor: '#333',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  applyFilterText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    borderRadius: 20,
    paddingHorizontal: 12,
    height: 40,
  },
  searchIcon: {
    width: 16,
    height: 16,
    tintColor: '#888',
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  filterButton: {
    marginLeft: 12,
    padding: 8,
  },
  filterIcon: {
    width: 20,
    height: 20,
    tintColor: '#333',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 12,
  },
  recommendedScrollView: {
    paddingHorizontal: 16,
  },
  recommendedCardWrapper: {
    flexDirection: "column",
    width: 280,
    marginRight: 16,
  },
  recommendedCard: {
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  recommendedImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  categoryTag: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
  },
  categoryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  recommendedContent: {
    marginTop: 8,
    width: '100%',
  },
  recommendedTitle: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  authorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  authorText: {
    color: '#000',
    fontSize: 12,
  },
  dateText: {
    color: '#000',
    fontSize: 10,
  },
  categoryScrollView: {
    paddingHorizontal: 16,
    marginTop: 24,
    marginBottom: 16,
  },
  categoryTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    marginRight: 8,
    backgroundColor: '#f2f2f2',
    borderWidth: 1,
    borderColor: "#000"
  },
  activeCategory: {
    backgroundColor: '#333',
  },
  categoryTabText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  activeCategoryText: {
    color: '#fff',
  },
  articleList: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  articleItem: {
    flexDirection: 'row',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 16,
  },
 
});

export default TechNewsApp;