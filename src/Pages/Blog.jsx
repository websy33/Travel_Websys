import React, { useState, useEffect } from 'react';

const Blog = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [expandedPosts, setExpandedPosts] = useState({});
  const [activeTab, setActiveTab] = useState('all');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);   
  const [likedPosts, setLikedPosts] = useState({});
  const [showShareModal, setShowShareModal] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);

  // Check scroll position to show/hide scroll to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-advance slides for travel guide
  useEffect(() => {
    if (travelGuides.length > 0) {
      const timer = setTimeout(() => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % travelGuides.length);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [currentSlide]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      
      // Reset subscription status after 5 seconds
      setTimeout(() => {
        setSubscribed(false);
      }, 5000);
    }
  };

  const handleExploreDestinations = () => {
    setSelectedDestination('overview');
  };

  const handleCloseModal = () => {
    setSelectedDestination(null);
  };

  const toggleReadMore = (postId) => {
    setExpandedPosts(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
    if (!showSearch) {
      setTimeout(() => {
        document.getElementById('search-input')?.focus();
      }, 100);
    } else {
      setSearchQuery('');
    }
  };

  const handleViewGallery = () => {
    setShowGallery(true);
    document.body.style.overflow = 'hidden'; // Prevent scrolling when gallery is open
  };

  const handleCloseGallery = () => {
    setShowGallery(false);
    setSelectedImage(null);
    document.body.style.overflow = 'auto'; // Re-enable scrolling
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const handleNextImage = () => {
    const currentIndex = galleryImages.findIndex(img => img.id === selectedImage.id);
    const nextIndex = (currentIndex + 1) % galleryImages.length;
    setSelectedImage(galleryImages[nextIndex]);
  };

  const handlePrevImage = () => {
    const currentIndex = galleryImages.findIndex(img => img.id === selectedImage.id);
    const prevIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
    setSelectedImage(galleryImages[prevIndex]);
  };

  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % travelGuides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + travelGuides.length) % travelGuides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const toggleLike = (postId) => {
    setLikedPosts(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const handleShare = (post) => {
    setCurrentPost(post);
    setShowShareModal(true);
  };

  const handleCloseShareModal = () => {
    setShowShareModal(false);
    setCurrentPost(null);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  };

  const featuredPost = {
    id: 1,
    title: 'Exploring the Beauty of Dal Lake',
    excerpt: 'Experience the magical shikara rides, floating gardens, and majestic mountain backdrop of one of India\'s most iconic destinations.',
    fullContent: 'Dal Lake is renowned for its colorful shikaras (wooden boats). Spread over 18 square kilometers, the lake is divided into four basins: Gagribal, Lokut Dal, Bod Dal and Nagin. The houseboats and floating gardens add to the beauty of the lake, making it a must-visit destination. The best time to visit is between April and October when the weather is pleasant and the gardens are in full bloom.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZ2_kf5c-W01e5YNAhgcdn_IZRU6b__M1DrA&s',
    category: 'Travel Diaries',
    date: 'June 15, 2023',
    author: 'Amit Kumar',
    readTime: '5 min read',
    likes: 243
  };

  const posts = [
    {
      id: 2,
      title: 'Skiing in the Himalayas',
      excerpt: 'Discover Asia\'s premier ski destination with powdery slopes and breathtaking gondola rides.',
      fullContent: 'Gulmarg, which means "Meadow of Flowers", is a town located at an altitude of 2,650 meters and is one of the highest ski destinations in the world. The Gulmarg Gondola is one of the highest cable cars in the world, taking visitors to a height of 3,980 meters. In winter, it transforms into a world-class ski resort with powdery snow, while in summer it becomes a paradise of colorful flowers and lush greenery.',
      image: 'https://static01.nyt.com/images/2021/03/22/world/00kashmir-ski-dispatch-003/merlin_185063628_de3c7d8a-2be1-4b51-93fc-99727bdb0d89-articleLarge.jpg?quality=75&auto=webp&disable=upscale',
      category: 'Adventure',
      date: 'May 10, 2023',
      likes: 187
    },
    {
      id: 3,
      title: 'Valley of Shepherds',
      excerpt: 'Walk through meadows of wildflowers and pine forests in this tranquil paradise.',
      fullContent: 'Pahalgam is a popular tourist destination and hill station located on the banks of the Lidder River at an altitude of 2,200 meters. The town offers breathtaking views of the mountains and is surrounded by dense forests of pine and cedar. Popular activities include trekking, golfing, and angling for trout fish in the Lidder River.',
      date: 'May 10, 2023',
      author: 'Priya Sharma',
      image: 'https://gulmargriders.com/wp-content/uploads/2020/11/2018112262-olw7ypbd89384q51lchohjza13bka5csbu3xhg62kq.jpeg',
      category: 'Nature',
      readTime: '6 min read',
      likes: 215
    },
    {
      id: 4,
      title: 'A Flavorful Journey',
      excerpt: 'From traditional feasts to special tea, explore the rich culinary heritage.',
      fullContent: 'The traditional multi-course meal includes many meat-based dishes like Rogan Josh, Yakhni, and Gushtaba. Vegetarian options include Dum Aloo and Nadru Yakhni (lotus stem cooked in yogurt gravy). No meal is complete without a cup of special tea, a traditional green tea preparation with almonds, cardamom, and saffron. The cuisine reflects the region\'s cultural heritage and is a must-try for every visitor.',
      date: 'April 28, 2023',
      author: 'Sameer Bhat',
      image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1971&q=80',
      category: 'Food & Culture',
      readTime: '7 min read',
      likes: 198
    },
    {
      id: 5,
      title: 'Living on the Lake',
      excerpt: 'A complete guide to experiencing the unique heritage of floating residences.',
      fullContent: 'Staying in a houseboat is a unique experience that shouldn\'t be missed. These beautifully crafted wooden boats feature intricately carved woodwork and are equipped with modern amenities. Most houseboats have a living room, bedrooms, and a bathroom, along with a dedicated staff. The houseboats are stationary and moored to the bank, providing a stable living experience. Many offer home-cooked meals, adding to the cultural immersion.',
      date: 'April 15, 2023',
      author: 'Nadia Mir',
      image: 'https://www.lakehouses4sale.net/uploads/what-does-it-mean-to-live-onatexaslake.jpeg',
      category: 'Unique Stays',
      readTime: '5 min read',
      likes: 176
    },
    {
      id: 6,
      title: 'Seasonal Guide: When to Visit',
      excerpt: 'Plan your perfect trip with our month-by-month breakdown of climate and events.',
      fullContent: 'The region experiences four distinct seasons, each offering a unique experience. Spring (March to May) is when the valley blooms with flowers and the weather is pleasant. Summer (June to August) is ideal for sightseeing and adventure activities with temperatures ranging from 14°C to 30°C. Autumn (September to November) offers stunning foliage and clear skies. Winter (December to February) transforms into a winter wonderland with heavy snowfall, perfect for skiing and snow activities. The best time to visit depends on your preferred activities.',
      date: 'March 28, 2023',
      author: 'Vikram Mehta',
      image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80',
      category: 'Travel Tips',
      readTime: '8 min read',
      likes: 231
    },
    {
      id: 7,
      title: 'Tourist Scams Around the World: How to Stay Safe',
      excerpt: '🌍✈️ Tourist Scams Around the World: Top Travel Scams You Must Know & How to Stay Safe in 2025 🧳🚨',
      fullContent: 'Traveling is one of the most rewarding experiences in life — exploring famous tourist destinations, discovering new cultures, and creating unforgettable memories. 🌐✨ But amidst the beauty and adventure, tourist scams around the world have become a growing problem that every traveler needs to be aware of. Scammers are becoming smarter, using modern tricks, fake offers, and emotional manipulation to trap tourists, especially in popular travel hotspots. 😬 From overpriced taxi rides at airports and fake tour guides offering "exclusive" deals, to pickpocketing scams in crowded tourist attractions and ATM fraud near famous landmarks, these scams can happen anywhere — whether you\'re visiting Europe, Asia, America, or tropical island destinations. 🏝️🚖 Criminals often target tourists because they\'re unfamiliar with the surroundings, distracted by sightseeing, or carrying extra cash and valuables. In 2025, travel scams have evolved, making it even more important to stay updated. Some scammers use social media tricks, QR code scams, or pose as helpful locals offering assistance to gain your trust. Others run fake booking websites, sell counterfeit tickets, or offer too-good-to-be-true vacation packages that disappear once you pay. These scams can ruin your trip, drain your bank account, and even put your safety at risk. 🚨💸 That\'s why learning about the top travel scams, latest tourist traps, and real-life scam stories is essential before you pack your bags. In this blog, we\'ll reveal the most common scams tourists face globally, highlight country-specific scams in popular destinations like Paris, Bangkok, Dubai, and Bali, and share expert travel safety tips to keep you protected. 📝🌏 Whether you\'re a solo traveler, couple on honeymoon, family on vacation, or digital nomad exploring new cities, staying informed is your first line of defense. By knowing what to look out for, you can avoid travel scams, save money, and enjoy a stress-free adventure. 🚀✨',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPoAbOVja6D0VU1fcKLdrvWPXu3cDYxFL94Q&s',
    category: 'Travel Safety',
    date: 'February 15, 2024',
    author: 'Security Expert Team',
    readTime: '10 min read',
    likes: 189
  }
];
  const destinations = [
    {
      id: 1,
      name: "Srinagar",
      description: "The summer capital, famous for its lake, gardens, and rich cultural heritage.",
      image: "https://www.kashmironline.com/top-destinations/srinagar/images/Downtown.jpg",
      bestTime: "April to October",
      attractions: ["Dal Lake", "Mughal Gardens", "Shankaracharya Temple", "Jama Masjid"]
    },
    {
      id: 2,
      name: "Gulmarg",
      description: "A picturesque hill station known for its skiing resorts, golf course, and cable car.",
      image: "https://s7ap1.scene7.com/is/image/incredibleindia/2-gulmarg-kashmir-j_k-city-hero?qlt=82&ts=1742154685264",
      bestTime: "December to March (skiing), April to June (sightseeing)",
      attractions: ["Gulmarg Gondola", "Skiing Slopes", "Golf Course", "Alpather Lake"]
    },
    {
      id: 3,
      name: "Pahalgam",
      description: "A serene valley town situated on the banks of the river, known as the 'Valley of Shepherds'.",
      image: "https://brownchinarkashmir.com/wp-content/uploads/2023/12/pahalgam_kashmir_brown_chinar_kashmir.jpg.webp",
      bestTime: "April to October",
      attractions: ["Betaab Valley", "Aru Valley", "Lidder River", "Baisaran Meadows"]
    },
    {
      id: 4,
      name: "Sonamarg",
      description: "Known as the 'Meadow of Gold', this destination offers breathtaking views of glaciers and alpine meadows.",
      image: "https://risingkashmir.blr1.digitaloceanspaces.com/wp-content/uploads/2024/04/02000405/8ef06cec-1a96-4280-a353-057f870c7aee.jpg",
      bestTime: "May to September",
      attractions: ["Thajiwas Glacier", "Zoji La Pass", "Nilagrad River", "Baltal Valley"]
    }
  ];

  const galleryImages = [
    {
      id: 1,
      src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS69mR9KcID1WodXoXJKFz4em28P74unLU63A&s",
      title: "Shikara Ride",
      description: "Colorful shikaras on the serene waters"
    },
    {
      id: 2,
      src: "https://www.kashmironline.com/blog/wp-content/uploads/2022/06/tulip1.jpg",
      title: "Tulip Garden",
      description: "Beautiful garden in full bloom"
    },
    {
      id: 3,
      src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRY8WirE1QG_dsfVhR6b2-70ruZu8P8dUSu-A&s",
      title: "Winter Landscape",
      description: "Snow-covered landscapes"
    },
    {
      id: 4,
      src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYf_3XFpTkcG9UJ-ykZ6pWaPDVo2IB6fugw&s",
      title: "Valley View",
      description: "Lush green meadows and pine forests"
    },
    {
      id: 5,
      src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8O7Y7y0eLaCvdZmff3yO_CSVOb8675L5Q&s",
      title: "Traditional Houseboat",
      description: "Intricately carved wooden houseboat"
    },
    {
      id: 6,
      src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjEaQU_cMSaaRXf9E_Mkq7s8jTH6uWXzUviJesTlAszjVwa4fvj870Jp3-rQLApKp24a8&usqp=CAU",
      title: "Mughal Gardens",
      description: "Gardens with terraced lawns and fountains"
    },
    {
      id: 7,
      src: "https://ap.rdcpix.com/81d3e44a4800f2e2b5c5c4bb44c5870cl-m2273880401rd-w480_h360.webp",
      title: "Meadow View",
      description: "Golden meadows surrounded by peaks"
    },
    {
      id: 8,
      src: "https://indianfolkart.org/wp-content/uploads/2022/04/SkillsAndTech-Jute-Handicrafts-1024x724.jpg",
      title: "Handicrafts",
      description: "Intricate shawls and wooden crafts"
    },
    {
      id: 9,
      src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfwOlA4BhbTFyaI-pEAgRdnIDuurJbMImdoA&s",
      title: "Local Cuisine",
      description: "Traditional feast with aromatic spices"
    }
  ];

  const travelGuides = [
    {
      id: 1,
      month: "January",
      globalDestinations: "Iceland, Switzerland, Thailand",
      indiaDestinations: "Gulmarg, Auli, Manali",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSub6zIIrKrDZ9rmCGTrir5R4LJWoGpQlSrfopw8xGpTkmR-FhI3OPWjZdhJrxVxKzAOFg&usqp=CAU",
      description: "Start the year with snowy adventures or tropical escapes"
    },
    {
      id: 2,
      month: "February",
      globalDestinations: "Venice, Maldives, New Orleans",
      indiaDestinations: "Goa, Jaipur, Kerala",
      image: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80",
      description: "Romantic getaways and festive celebrations"
    },
    {
      id: 3,
      month: "March",
      globalDestinations: "Japan, Morocco, Spain",
      indiaDestinations: "Rishikesh, Varanasi, Khajuraho",
      image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80",
      description: "Spring blossoms and cultural festivals"
    },
    {
      id: 4,
      month: "April",
      globalDestinations: "Netherlands, Paris, Nepal",
      indiaDestinations: "Shillong, Darjeeling, Kashmir",
      image: "https://images.unsplash.com/photo-1524351199678-941a58a3df50?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80",
      description: "Blooming beauty and perfect weather for exploration"
    },
    {
      id: 5,
      month: "May",
      globalDestinations: "Greece, Turkey, South Africa",
      indiaDestinations: "Ladakh, Coorg, Ooty",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJ2ILsgP71NjiGlzzjz3iStG04c2SnjN7hg0Qy7SO6ijtysmJ5Bq_rgtZ6v2vw7mdXgO4&usqp=CAU",
      description: "Early summer adventures before the crowds arrive"
    },
    {
      id: 6,
      month: "June",
      globalDestinations: "Norway, Bali, Canada",
      indiaDestinations: "Spiti Valley, Munnar, Andamans",
      image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80",
      description: "Long days and endless exploration opportunities"
    },
    {
      id: 7,
      month: "July",
      globalDestinations: "France, Peru, Kenya",
      indiaDestinations: "Leh-Ladakh, Sikkim, Mount Abu",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDOTTVvK3CUdQvyu7qlEPfnDpe6qa7GU72YDtYCrnLYrmoLtb6UcDPADjqbawR4Hhqq6Y&usqp=CAU",
      description: "Summer festivals and wildlife encounters"
    },
    {
      id: 8,
      month: "August",
      globalDestinations: "Scotland, Iceland, Komodo Islands",
      indiaDestinations: "Kodaikanal, Coonoor, Cherrapunji",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80",
      description: "Monsoon magic and cultural celebrations"
    },
    {
      id: 9,
      month: "September",
      globalDestinations: "Italy, Germany, China",
      indiaDestinations: "Ziro Valley, Kutch, Varanasi",
      image: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80",
      description: "Harvest festivals and comfortable weather for travel"
    },
    {
      id: 10,
      month: "October",
      globalDestinations: "New England, Mexico, Jordan",
      indiaDestinations: "Rajasthan, Hampi, Mysore",
      image: "https://images.unsplash.com/photo-1501555088652-021faa106b9b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80",
      description: "Fall foliage and cultural celebrations"
    },
    {
      id: 11,
      month: "November",
      globalDestinations: "Dubai, Vietnam, Patagonia",
      indiaDestinations: "Pondicherry, Gokarna, Varkala",
      image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80",
      description: "Perfect weather for beach vacations and desert adventures"
    },
    {
      id: 12,
      month: "December",
      globalDestinations: "Austria, Australia, Lapland",
      indiaDestinations: "Goa, Kerala, Andaman Islands",
      image: "https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80",
      description: "Festive celebrations and winter wonderlands"
    }
  ];

  const categories = ['All', 'Adventure', 'Nature', 'Food & Culture', 'Unique Stays', 'Travel Tips', 'Travel Safety'];
  
  // Filter posts based on active tab and search query
  const filteredPosts = (activeTab === 'all' ? posts : posts.filter(post => post.category === activeTab))
    .filter(post => 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      {/* Hero Section */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center z-0 transition-transform duration-700 hover:scale-105"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80)' }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-pink-900/70 to-purple-900/70"></div>
        </div>
        <div className="relative z-10 text-center text-white px-4 max-w-4xl animate-fade-in-up">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">Discover Hidden Gems</h2>
          <p className="text-xl md:text-2xl mb-8 text-pink-100">Your ultimate guide to mesmerizing beauty</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={handleExploreDestinations}
              className="px-8 py-4 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-lg hover:from-pink-600 hover:to-pink-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl text-lg transform hover:-translate-y-1"
            >
              Explore Destinations
            </button>
            <button
              onClick={handleViewGallery}
              className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg hover:bg-white/20 transition-all duration-300 font-semibold text-lg transform hover:-translate-y-1"
            >
              View Gallery
            </button>
          </div>
        </div>
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>

      <main className="container mx-auto px-4 py-16">
        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {[
            { number: '50+', label: 'Destinations' },
            { number: '200+', label: 'Travel Guides' },
            { number: '15K', label: 'Monthly Readers' },
            { number: '95%', label: 'Visitor Satisfaction' }
          ].map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-6 text-center shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2">
              <div className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">{stat.number}</div>
              <div className="text-gray-600 mt-2">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Featured Post */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">
              Featured Destination
            </h2>
            <div className="flex items-center text-pink-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {featuredPost.readTime}
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-500 hover:shadow-2xl">
            <div className="md:flex">
              <div className="md:flex-shrink-0 md:w-1/2 relative overflow-hidden">
                <img
                  className="h-64 w-full object-cover md:h-full transition-transform duration-700 hover:scale-105"
                  src={featuredPost.image}
                  alt={featuredPost.title} />
                <div className="absolute top-4 left-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs px-3 py-1 rounded-full shadow-md">
                  {featuredPost.category}
                </div>
              </div>
              <div className="p-8">
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <span>{featuredPost.date}</span>
                  <span className="mx-2">•</span>
                  <span>By {featuredPost.author}</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 hover:text-pink-600 transition-colors cursor-pointer">{featuredPost.title}</h3>
                <p className="text-gray-600 leading-relaxed mb-4">{featuredPost.excerpt}</p>
                {expandedPosts[featuredPost.id] && (
                  <p className="text-gray-700 leading-relaxed mb-4 animate-fade-in">{featuredPost.fullContent}</p>
                )}

                <div className="flex items-center justify-between mt-6">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => toggleLike(featuredPost.id)}
                      className="flex items-center text-gray-500 hover:text-pink-500 transition-colors group"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-6 w-6 ${likedPosts[featuredPost.id] ? 'text-pink-500 fill-current' : 'group-hover:scale-110 transition-transform'}`}
                        fill={likedPosts[featuredPost.id] ? "currentColor" : "none"}
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      <span className="ml-1">{featuredPost.likes + (likedPosts[featuredPost.id] ? 1 : 0)}</span>
                    </button>

                    <button
                      onClick={() => handleShare(featuredPost)}
                      className="flex items-center text-gray-500 hover:text-blue-500 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                      <span className="ml-1">Share</span>
                    </button>
                  </div>

                  <button
                    onClick={() => toggleReadMore(featuredPost.id)}
                    className="inline-flex items-center text-pink-500 hover:text-pink-700 font-medium group"
                  >
                    {expandedPosts[featuredPost.id] ? 'Read Less' : 'Read Full Article'}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Travel Guide Section - Enhanced */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">
              Best Places to Visit Month by Month
            </h2>
            <button
              onClick={() => handleShare({ title: "Best Places to Visit Month by Month", excerpt: "Discover the perfect destinations to visit each month around the world and in India." })}
              className="flex items-center text-pink-600 hover:text-pink-700 transition-colors"
              title="Share this guide"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Share Guide
            </button>
          </div>
          <p className="text-gray-600 max-w-3xl mb-12">
            Every destination has its moment. Our month-by-month travel guide helps you discover the perfect places to visit around the world and in India throughout the year.
          </p>

          <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Share Button */}
            <button
              onClick={() => handleShare({ title: "Best Places to Visit Month by Month", excerpt: "Discover the perfect destinations to visit each month around the world and in India." })}
              className="absolute top-4 right-4 z-10 bg-white/80 hover:bg-white text-pink-600 rounded-full p-2 shadow-md transition-all duration-300 hover:scale-110"
              title="Share this guide"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>

            {/* Slider Navigation */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-pink-600 rounded-full p-3 shadow-md transition-all duration-300 hover:scale-110"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-pink-600 rounded-full p-3 shadow-md transition-all duration-300 hover:scale-110"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Slide Content */}
            <div className="relative h-96 overflow-hidden">
              {travelGuides.map((guide, index) => (
                <div
                  key={guide.id}
                  className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
                >
                  <div className="flex flex-col md:flex-row h-full">
                    <div className="md:w-1/2 h-full overflow-hidden">
                      <img
                        src={guide.image}
                        alt={guide.month}
                        className="w-full h-full object-cover transition-transform duration-1000 ease-in-out hover:scale-105" />
                      <div className="absolute top-4 left-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs px-3 py-1 rounded-full shadow-md">
                        {guide.month}
                      </div>
                    </div>
                    <div className="md:w-1/2 p-8 flex flex-col justify-center bg-gradient-to-br from-pink-50 to-purple-50">
                      <h3 className="text-4xl font-bold text-pink-600 mb-4">{guide.month}</h3>
                      <p className="text-gray-700 mb-6 italic font-medium">{guide.description}</p>

                      <div className="mb-6">
                        <h4 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Global Destinations
                        </h4>
                        <p className="text-gray-600 bg-white/50 p-3 rounded-lg">{guide.globalDestinations}</p>
                      </div>

                      <div>
                        <h4 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0" />
                          </svg>
                          Indian Destinations
                        </h4>
                        <p className="text-gray-600 bg-white/50 p-3 rounded-lg">{guide.indiaDestinations}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Slide Indicators */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
              {travelGuides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide ? 'bg-pink-600 scale-125' : 'bg-gray-300 hover:bg-pink-400'}`}
                  aria-label={`Go to slide ${index + 1}`} />
              ))}
            </div>
          </div>
          <div className="mt-8 text-center">
            <p className="text-gray-600 max-w-3xl mx-auto">
              No matter the month, there is always a corner of the world waiting to welcome you. Whether you crave snow, sunshine, festivals, or quiet escapes, our travel guide helps you plan unforgettable journeys all year round.
            </p>
          </div>
        </section>

        {/* Category Tabs */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">
            Explore Destinations
          </h2>
          {/* Search Results Info */}
          {searchQuery && (
            <div className="mb-6 text-center animate-fade-in">
              <p className="text-gray-600">
                Showing {filteredPosts.length} results for "<span className="font-semibold">{searchQuery}</span>"
                <button 
                  onClick={() => setSearchQuery('')}
                  className="ml-2 text-pink-600 hover:text-pink-700 text-sm transition-colors"
                >
                  Clear search
                </button>
              </p>
            </div>
          )}
          
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveTab(category === 'All' ? 'all' : category)}
                className={`px-4 py-2 rounded-full transition-all duration-300 transform hover:-translate-y-1 ${activeTab === (category === 'All' ? 'all' : category) 
                  ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md' 
                  : 'bg-white text-gray-700 hover:bg-gray-100 shadow-sm'}`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Recent Posts */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.length > 0 ? (
              filteredPosts.map(post => (
                <div key={post.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group">
                  <div className="relative overflow-hidden">
                    <img 
                      className="h-48 w-full object-cover transition-transform duration-700 group-hover:scale-110" 
                      src={post.image} 
                      alt={post.title} 
                    />
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs px-3 py-1 rounded-full shadow-md">
                      {post.category}
                    </div>
                    <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/60 to-transparent"></div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center text-xs text-gray-500 mb-3">
                      <span>{post.date}</span>
                      <span className="mx-2">•</span>
                      <span>{post.readTime}</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 hover:text-pink-600 cursor-pointer transition-colors">{post.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">{post.excerpt}</p>
                    {expandedPosts[post.id] && (
                      <p className="text-gray-700 text-sm mb-4 leading-relaxed animate-fade-in">{post.fullContent}</p>
                    )}
                    
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center">
                        <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-full h-8 w-8 flex items-center justify-center mr-2 shadow-inner">
                          <span className="text-pink-700 text-xs font-bold">{post.author?.charAt(0) || 'U'}</span>
                        </div>
                        <span className="text-xs text-gray-600">{post.author || 'Unknown'}</span>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <button 
                          onClick={() => toggleLike(post.id)}
                          className="flex items-center text-gray-500 hover:text-pink-500 transition-colors group"
                          title="Like this post"
                        >
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className={`h-5 w-5 ${likedPosts[post.id] ? 'text-pink-500 fill-current' : 'group-hover:scale-110 transition-transform'}`} 
                            fill={likedPosts[post.id] ? "currentColor" : "none"} 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                          <span className="text-xs ml-1">{post.likes + (likedPosts[post.id] ? 1 : 0)}</span>
                        </button>
                        
                        <button 
                          onClick={() => handleShare(post)}
                          className="text-gray-500 hover:text-blue-500 transition-colors"
                          title="Share this post"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => toggleReadMore(post.id)}
                      className="w-full mt-4 text-center text-pink-500 hover:text-pink-700 text-sm font-medium transition-colors flex items-center justify-center group"
                    >
                      {expandedPosts[post.id] ? 'Read Less' : 'Read More'}
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12 animate-fade-in">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-700">No articles found</h3>
                <p className="text-gray-500 mt-2">Try a different search term or browse all categories</p>
              </div>
            )}
          </div>
        </section>

        {/* Newsletter */}
        <section className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-8 mb-12 shadow-md transition-all duration-300 hover:shadow-lg">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Travel Newsletter</h2>
            <p className="mb-6 text-gray-600">Subscribe for exclusive travel tips and seasonal guides</p>
            
            {subscribed ? (
              <div className="bg-gradient-to-r from-pink-100 to-purple-100 text-pink-700 p-4 rounded-lg border border-pink-200 animate-fade-in shadow-inner">
                <div className="flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-pink-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Thank you for subscribing! Check your inbox for our latest updates.
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 animate-fade-in">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="flex-grow px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 border border-gray-300 shadow-sm transition-all duration-300 focus:shadow-md"
                  required
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:from-pink-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-pink-500 font-medium transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </section>
      </main>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button 
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-pink-500 to-purple-500 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-40 transform hover:-translate-y-1 animate-bounce"
          aria-label="Scroll to top"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      )}

      {/* Destinations Modal */}
      {selectedDestination && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 sticky top-0 bg-white border-b flex justify-between items-center shadow-sm">
              <h2 className="text-2xl font-bold text-gray-800">Travel Destinations</h2>
              <button 
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {destinations.map(destination => (
                <div key={destination.id} className="bg-gray-50 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                  <div className="overflow-hidden">
                    <img 
                      src={destination.image} 
                      alt={destination.name}
                      className="w-full h-48 object-cover transition-transform duration-700 hover:scale-110"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{destination.name}</h3>
                    <p className="text-gray-600 mb-3">{destination.description}</p>
                    <div className="mb-3">
                      <span className="font-semibold text-pink-600">Best Time to Visit:</span>
                      <span className="text-gray-700 ml-2">{destination.bestTime}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-pink-600">Main Attractions:</span>
                      <ul className="text-gray-700 mt-1 space-y-1">
                        {destination.attractions.map((attr, index) => (
                          <li key={index} className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                            {attr}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-6 border-t bg-gray-50 rounded-b-2xl text-center">
              <button 
                onClick={handleCloseModal}
                className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:from-pink-600 hover:to-purple-600 font-medium transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Gallery Modal */}
      {showGallery && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4 animate-fade-in overflow-y-auto">
          <div className="w-full max-w-6xl">
            <div className="flex justify-between items-center mb-6 sticky top-0 bg-black/80 backdrop-blur-sm p-4 rounded-lg z-10">
              <h2 className="text-2xl font-bold text-white">Travel Gallery</h2>
              <button 
                onClick={handleCloseGallery}
                className="text-white hover:text-pink-400 transition-colors p-1 rounded-full hover:bg-white/10"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {galleryImages.map(image => (
                <div 
                  key={image.id} 
                  className="relative group cursor-pointer overflow-hidden rounded-xl transform transition-all duration-500 hover:scale-105"
                  onClick={() => handleImageClick(image)}
                >
                  <img 
                    src={image.src} 
                    alt={image.title}
                    className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <div className="text-white">
                      <h3 className="font-bold text-lg">{image.title}</h3>
                      <p className="text-sm">{image.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center">
              <button 
                onClick={handleCloseGallery}
                className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:from-pink-600 hover:to-purple-600 font-medium transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                Close Gallery
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox for Gallery Images */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50 animate-fade-in">
          <div className="relative max-w-4xl w-full max-h-screen p-4">
            <button 
              onClick={handleCloseGallery}
              className="absolute top-4 right-4 text-white hover:text-pink-400 z-10 bg-black/50 rounded-full p-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <button 
              onClick={handlePrevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-pink-400 z-10 bg-black/50 rounded-full p-3"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button 
              onClick={handleNextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-pink-400 z-10 bg-black/50 rounded-full p-3"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            
            <div className="flex flex-col items-center">
              <img 
                src={selectedImage.src} 
                alt={selectedImage.title}
                className="max-w-full max-h-[70vh] object-contain rounded-lg"
              />
              <div className="text-white mt-4 text-center">
                <h3 className="text-xl font-bold">{selectedImage.title}</h3>
                <p className="text-gray-300">{selectedImage.description}</p>
                <p className="text-sm text-gray-400 mt-2">{galleryImages.findIndex(img => img.id === selectedImage.id) + 1} of {galleryImages.length}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && currentPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Share this post</h3>
              <button 
                onClick={handleCloseShareModal}
                className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-600">Share "{currentPost.title}" with others</p>
            </div>
            
            <div className="grid grid-cols-4 gap-4 mb-6">
              <a 
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <svg className="h-8 w-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 .792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span className="mt-1 text-sm text-gray-600">Facebook</span>
              </a>
              
              <a 
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(currentPost.title)}&url=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <svg className="h-8 w-8 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
                <span className="mt-1 text-sm text-gray-600">Twitter</span>
              </a>
              
              <a 
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <svg className="h-8 w-8 text-blue-700" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                <span className="mt-1 text-sm text-gray-600">LinkedIn</span>
              </a>
              
              <button 
                onClick={copyToClipboard}
                className="flex flex-col items-center p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                <span className="mt-1 text-sm text-gray-600">Copy Link</span>
              </button>
            </div>
            
            <div className="flex justify-end">
              <button 
                onClick={handleCloseShareModal}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add custom styles for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out;
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.7s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Blog;