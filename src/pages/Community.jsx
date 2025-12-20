import React, { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  MessageCircle, 
  Users, 
  Trophy,
  Star,
  Send,
  Heart,
  Share,
  Image,
  Mic,
  Paperclip,
  CheckCircle,
  Plus
} from "lucide-react";
import { formatDistanceToNow } from 'date-fns';

const Avatar = ({ user }) => (
    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shrink-0">
        {user?.profile_picture_url ? (
            <img src={user.profile_picture_url} alt={user.full_name} className="w-full h-full rounded-full object-cover" />
        ) : (
            <span className="text-white font-semibold text-sm">{user?.full_name?.slice(0, 2).toUpperCase() || '??'}</span>
        )}
    </div>
);

export default function Community() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('feed');
  
  const [posts, setPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostImage, setNewPostImage] = useState(null);
  const [isPosting, setIsPosting] = useState(false);
  const imageInputRef = useRef(null);

  const [topTraders, setTopTraders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [following, setFollowing] = useState(new Set());

  useEffect(() => {
    const loadData = async () => {
        try {
            const user = await base44.auth.me();
            setCurrentUser(user);

            const [postsData, tradersData, reviewsData, followsData] = await Promise.all([
                base44.entities.Post.list("-created_date", 20),
                base44.entities.User.list("-created_date", 5),
                base44.entities.Review.list("-created_date", 5),
                base44.entities.Follow.filter({ follower_email: user.email })
            ]);

            setPosts(postsData);
            setTopTraders(tradersData);
            setReviews(reviewsData);
            setFollowing(new Set(followsData.map(f => f.following_email)));
        } catch (error) {
            console.error("Error loading community data", error);
        }
    }
    loadData();
  }, []);

  const handleCreatePost = async () => {
    if (!newPostContent.trim() || isPosting) return;
    setIsPosting(true);

    try {
        let imageUrl = '';
        if (newPostImage) {
            const { file_url } = await base44.integrations.Core.UploadFile({ file: newPostImage });
            imageUrl = file_url;
        }

        await base44.entities.Post.create({ content: newPostContent, image_url: imageUrl });
        
        setNewPostContent('');
        setNewPostImage(null);
        // Refresh posts list
        const postsData = await base44.entities.Post.list("-created_date", 20);
        setPosts(postsData);
    } catch (error) {
        console.error("Error creating post:", error);
    } finally {
        setIsPosting(false);
    }
  };

  const handleFollowToggle = async (traderEmail) => {
    const isCurrentlyFollowing = following.has(traderEmail);
    const updatedFollowing = new Set(following);

    try {
        if (isCurrentlyFollowing) {
            const followRecord = await base44.entities.Follow.filter({ follower_email: currentUser.email, following_email: traderEmail });
            if(followRecord.length > 0) await base44.entities.Follow.delete(followRecord[0].id);
            updatedFollowing.delete(traderEmail);
        } else {
            await base44.entities.Follow.create({ follower_email: currentUser.email, following_email: traderEmail });
            updatedFollowing.add(traderEmail);
        }
        setFollowing(updatedFollowing);
    } catch (error) {
        console.error("Error toggling follow:", error);
    }
  };

  const reviewsData = [
    {
      user: "Sarah M.",
      avatar: "SM",
      rating: 5,
      content: "Best trading platform I've ever used. The AI strategies are incredible and customer support is top-notch!",
      date: "2 days ago",
      profit: "+$8,450"
    },
    {
      user: "Mike R.",
      avatar: "MR",
      rating: 5,
      content: "Started with $1000 and now at $3500 in just 3 months. The risk management features saved me multiple times.",
      date: "1 week ago",
      profit: "+$2,500"
    },
    {
      user: "Elena K.",
      avatar: "EK",
      rating: 4,
      content: "Great platform for beginners. The educational content helped me understand trading fundamentals.",
      date: "2 weeks ago",
      profit: "+$1,200"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Users className="w-8 h-8" />
            Trading Community
          </h1>
          <p className="text-slate-400">
            Connect with fellow traders, share strategies, and learn from the best
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-slate-800/50 p-1 rounded-lg w-fit">
            {[
              { id: 'feed', label: 'Community Feed', icon: MessageCircle },
              { id: 'leaderboard', label: 'Top Traders', icon: Trophy },
              { id: 'reviews', label: 'Reviews', icon: Star }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === tab.id 
                    ? 'bg-green-500 text-white' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {activeTab === 'feed' && (
              <div className="space-y-6">
                {/* New Post */}
                <Card className="glass-card">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <Avatar user={currentUser} />
                      <div className="flex-1">
                        <Textarea
                          placeholder="Share your trading insights, strategies, or ask questions..."
                          value={newPostContent}
                          onChange={(e) => setNewPostContent(e.target.value)}
                          className="bg-slate-800/50 border-slate-600 text-white mb-4"
                          rows={3}
                        />
                        {newPostImage && <div className="text-sm text-slate-300 mb-2">Image attached: {newPostImage.name}</div>}
                        <div className="flex items-center justify-between">
                          <div className="flex gap-2">
                            <input type="file" ref={imageInputRef} onChange={(e) => setNewPostImage(e.target.files[0])} className="hidden" accept="image/*" />
                            <Button size="sm" variant="outline" className="border-slate-600 text-slate-300" onClick={() => imageInputRef.current.click()}>
                              <Image className="w-4 h-4 mr-2" />
                              Image
                            </Button>
                            <Button size="sm" variant="outline" className="border-slate-600 text-slate-300" disabled>
                              <Mic className="w-4 h-4 mr-2" />
                              Voice
                            </Button>
                            <Button size="sm" variant="outline" className="border-slate-600 text-slate-300" disabled>
                              <Paperclip className="w-4 h-4 mr-2" />
                              File
                            </Button>
                          </div>
                          <Button 
                            className="bg-green-600 hover:bg-green-700"
                            disabled={isPosting || !newPostContent.trim()}
                            onClick={handleCreatePost}
                          >
                            <Send className="w-4 h-4 mr-2" />
                            {isPosting ? "Posting..." : "Post"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Posts Feed */}
                {posts.map((post) => (
                  <Card key={post.id} className="glass-card">
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        <Avatar user={{ full_name: post.created_by.split('@')[0], profile_picture_url: null }} />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold text-white">{post.created_by.split('@')[0]}</span>
                            <Badge variant="outline" className="text-slate-400 border-slate-600 text-xs">
                              Pro Trader
                            </Badge>
                            <span className="text-slate-400 text-sm">•</span>
                            <span className="text-slate-400 text-sm">{formatDistanceToNow(new Date(post.created_date), { addSuffix: true })}</span>
                          </div>
                          <p className="text-slate-300 mb-4 whitespace-pre-wrap">{post.content}</p>
                          {post.image_url && <img src={post.image_url} alt="Post image" className="rounded-lg border border-slate-700 max-h-96 w-auto" />}
                          <div className="flex items-center gap-4 text-slate-400 mt-4">
                            <button className="flex items-center gap-1 hover:text-red-400 transition-colors">
                              <Heart className="w-4 h-4" />
                              <span className="text-sm">{post.likes_count || 0}</span>
                            </button>
                            <button className="flex items-center gap-1 hover:text-blue-400 transition-colors">
                              <MessageCircle className="w-4 h-4" />
                              <span className="text-sm">{post.comments_count || 0}</span>
                            </button>
                            <button className="flex items-center gap-1 hover:text-green-400 transition-colors">
                              <Share className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {activeTab === 'leaderboard' && (
              <div className="space-y-6">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-yellow-400" />
                      Top Performers This Month
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {topTraders.map((trader, index) => (
                        <div key={trader.id} className="flex items-center gap-4 p-4 rounded-lg bg-slate-800/30">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                            index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-500'
                          }`}>
                            #{index + 1}
                          </div>
                          <Avatar user={trader} />
                          <div className="flex-1">
                            <div className="font-semibold text-white">{trader.full_name || trader.email.split('@')[0]}</div>
                            <div className="text-sm text-slate-400">1.2k followers</div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-green-400">+$45,230</div>
                            <div className="text-sm text-slate-400">94% win rate</div>
                          </div>
                          {currentUser?.email !== trader.email && (
                            <Button 
                                size="sm" 
                                className={following.has(trader.email) ? 'bg-slate-700 hover:bg-slate-600' : 'bg-blue-600 hover:bg-blue-700'}
                                onClick={() => handleFollowToggle(trader.email)}
                            >
                                {following.has(trader.email) ? <CheckCircle className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                                {following.has(trader.email) ? 'Following' : 'Follow'}
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-400" />
                      User Reviews & Testimonials
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {reviewsData.map((review, index) => (
                        <div key={index} className="p-4 rounded-lg bg-slate-800/30">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                              <span className="text-white font-semibold text-sm">{review.avatar}</span>
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold text-white">{review.user}</div>
                              <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1">
                                  {[...Array(review.rating)].map((_, i) => (
                                    <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                                  ))}
                                </div>
                                <span className="text-slate-400 text-sm">•</span>
                                <span className="text-slate-400 text-sm">{review.date}</span>
                              </div>
                            </div>
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                              {review.profit}
                            </Badge>
                          </div>
                          <p className="text-slate-300">{review.content}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Community Stats */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white">Community Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Active Traders</span>
                    <span className="text-white font-semibold">15,247</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Posts Today</span>
                    <span className="text-white font-semibold">342</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Profit</span>
                    <span className="text-green-400 font-semibold">$2.8M</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Avg Win Rate</span>
                    <span className="text-white font-semibold">76.3%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Trending Topics */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Trending Topics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['#BTCBreakout', '#AITrading', '#RiskManagement', '#DeFiYield', '#TechnicalAnalysis'].map((tag, index) => (
                    <div key={index} className="flex items-center justify-between p-2 rounded bg-slate-800/30 hover:bg-slate-800/50 transition-colors cursor-pointer">
                      <span className="text-green-400 font-medium">{tag}</span>
                      <span className="text-slate-400 text-sm">{Math.floor(Math.random() * 100) + 20} posts</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}