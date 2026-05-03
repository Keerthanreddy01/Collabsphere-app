import React, { memo } from 'react';
import {
   StyleSheet,
   View,
   ScrollView,
   TouchableOpacity,
   Dimensions,
   Image,
   StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Grid, Plus } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { Typography } from '../components/Typography';

const { width } = Dimensions.get('window');

export const HomeScreen = ({ navigation }: any) => {
   return (
      <View style={styles.container}>
         <StatusBar barStyle="light-content" />
         <SafeAreaView style={{ flex: 1 }}>
            <ScrollView
               showsVerticalScrollIndicator={false}
               contentContainerStyle={styles.scrollContent}
            >
               {/* Header Section */}
               <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.header}>
                  <View style={styles.headerLeft}>
                     <Image
                        source={{ uri: 'https://i.pravatar.cc/150?u=keerthan' }}
                        style={styles.avatar}
                     />
                     <View>
                        <Typography style={styles.greeting}>Hi, Developer</Typography>
                        <Typography style={styles.subtitle}>Let's build something amazing</Typography>
                     </View>
                  </View>
                  <TouchableOpacity style={styles.menuBtn} activeOpacity={0.8}>
                     <Grid size={20} color="#FFF" />
                  </TouchableOpacity>
               </Animated.View>

               {/* Main Grid Content */}
               <View style={styles.gridContainer}>
                  {/* Left Column */}
                  <View style={styles.column}>
                     {/* Create New Project Widget */}
                     <Animated.View entering={FadeInDown.delay(200).springify()} style={[styles.card, styles.createProjectCard]}>
                        <TouchableOpacity style={{ flex: 1, justifyContent: 'space-between' }} activeOpacity={0.8}>
                           <Typography style={styles.cardTitle}>Create{'\n'}New Project</Typography>
                           <View style={styles.plusContainer}>
                              <Plus size={28} color="#FFF" />
                           </View>
                        </TouchableOpacity>
                     </Animated.View>
                  </View>

                  {/* Right Column */}
                  <View style={styles.column}>
                     
                  </View>
               </View>

            </ScrollView>
         </SafeAreaView>
      </View>
   );
};

const styles = StyleSheet.create({
   container: { flex: 1, backgroundColor: '#090A0F' },
   scrollContent: { paddingBottom: 100, paddingHorizontal: 20, paddingTop: 20 },
   
   header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 30,
   },
   headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
   },
   avatar: { width: 48, height: 48, borderRadius: 24 },
   greeting: { fontSize: 18, fontWeight: '700', color: '#FFF' },
   subtitle: { fontSize: 13, color: '#8A8A93', marginTop: 2 },
   
   menuBtn: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: '#5C44FF',
      justifyContent: 'center',
      alignItems: 'center',
   },
   
   gridContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
   },
   column: {
      width: '47.5%',
      gap: 16,
   },
   
   card: {
      backgroundColor: '#15161E',
      borderRadius: 28,
      padding: 20,
      overflow: 'hidden',
   },
   cardTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: '#FFF',
      lineHeight: 22,
   },
   createProjectCard: {
      height: 200,
      borderStyle: 'dashed',
      borderWidth: 1.5,
      borderColor: '#2A2B36',
   },
   plusContainer: {
      alignSelf: 'center',
      marginBottom: 20,
   },
});
