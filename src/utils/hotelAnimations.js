// Framer Motion Animation Variants for Hotel Components

/**
 * Container animation with staggered children
 */
export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

/**
 * Item fade-in from bottom animation
 */
export const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

/**
 * Card hover and entrance animation
 */
export const cardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  },
  hover: {
    scale: 1.02,
    y: -5,
    transition: {
      duration: 0.3,
      ease: "easeInOut"
    }
  }
};

/**
 * Modal/Dialog entrance and exit animations
 */
export const modalVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    transition: {
      duration: 0.3,
      ease: "easeIn"
    }
  }
};

/**
 * Fade in animation
 */
export const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3
    }
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2
    }
  }
};

/**
 * Slide from left animation
 */
export const slideInLeftVariants = {
  hidden: { x: -100, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

/**
 * Slide from right animation
 */
export const slideInRightVariants = {
  hidden: { x: 100, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

/**
 * Scale in animation (bounce effect)
 */
export const scaleInVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20
    }
  }
};

/**
 * Rotate in animation
 */
export const rotateInVariants = {
  hidden: { rotate: -180, opacity: 0 },
  visible: {
    rotate: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

/**
 * List item stagger animation
 */
export const listItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (index) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: index * 0.1,
      duration: 0.4
    }
  })
};

/**
 * Button hover animation
 */
export const buttonHoverVariants = {
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2,
      ease: "easeInOut"
    }
  },
  tap: {
    scale: 0.95
  }
};

/**
 * Notification slide in from top
 */
export const notificationVariants = {
  hidden: { y: -100, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 30
    }
  },
  exit: {
    y: -100,
    opacity: 0,
    transition: {
      duration: 0.3
    }
  }
};

/**
 * Page transition animation
 */
export const pageTransitionVariants = {
  initial: { opacity: 0, x: -20 },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: "easeInOut"
    }
  },
  exit: {
    opacity: 0,
    x: 20,
    transition: {
      duration: 0.3
    }
  }
};

/**
 * Drawer slide in from side
 */
export const drawerVariants = {
  hidden: { x: "100%", opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  },
  exit: {
    x: "100%",
    opacity: 0,
    transition: {
      duration: 0.3
    }
  }
};

/**
 * Accordion content animation
 */
export const accordionVariants = {
  collapsed: {
    height: 0,
    opacity: 0,
    transition: {
      duration: 0.3
    }
  },
  expanded: {
    height: "auto",
    opacity: 1,
    transition: {
      duration: 0.3
    }
  }
};

export default {
  containerVariants,
  itemVariants,
  cardVariants,
  modalVariants,
  fadeInVariants,
  slideInLeftVariants,
  slideInRightVariants,
  scaleInVariants,
  rotateInVariants,
  listItemVariants,
  buttonHoverVariants,
  notificationVariants,
  pageTransitionVariants,
  drawerVariants,
  accordionVariants
};
