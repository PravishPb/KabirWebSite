import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eyebrow, AsyncImage, PlaceholderImg, Icon, EventSearch } from '../components/ui';
import { AnimatedSection } from '../components/ui/AnimatedSection';
import { useTranslation } from '../locales/useTranslation';
import { useEvents } from '../hooks/useEvents';
import { useEventFilters } from '../hooks/useEventFilters';
import './BlogPage.css'; // Reusing blog grid styles
import './EventsPage.css'; // Dedicated stylesheet for layout and styles

const gradients = [
  'linear-gradient(135deg, #2c5f3a 0%, #112617 100%)',
  'linear-gradient(135deg, #563401 0%, #d98204 100%)',
  'linear-gradient(135deg, #1b1e1c 0%, #4d504e 100%)',
  'linear-gradient(135deg, #412701 0%, #ad6803 100%)',
];

export default function EventsPage() {
  const t = useTranslation('EventsPage');
  const { events, loading } = useEvents();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [pastLimit, setPastLimit] = useState(6);

  // Filtering Logic
  const { searchQuery, setSearchQuery, filteredEvents } = useEventFilters(events);

  // Split events into upcoming and past
  const now = new Date();
  
  // Set time to midnight for accurate day comparison if event_time is null
  now.setHours(0, 0, 0, 0);

  const upcomingEvents = [];
  const pastEvents = [];

  filteredEvents.forEach(ev => {
    const eventDate = new Date(ev.event_date);
    if (ev.event_time) {
      const [hours, minutes] = ev.event_time.split(':');
      eventDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
    }
    
    // An event is past if its date (and time) is strictly before now
    if (eventDate < now) {
      pastEvents.push(ev);
    } else {
      upcomingEvents.push(ev);
    }
  });

  // Sort upcoming ascending (soonest first)
  upcomingEvents.sort((a, b) => new Date(a.event_date) - new Date(b.event_date));
  // Past events are already descending from useEvents hook

  const decodeHTML = (html) => {
    if (!html) return '';
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  };

  const renderEventCard = (ev, i) => (
    <motion.div 
      key={ev.id}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: i * 0.1 }}
    >
      <article className="blog-card event-card" onClick={() => setSelectedEvent(ev)}>
        <div className="blog-card-img-wrapper">
          {ev.image_url ? (
            <AsyncImage
              src={ev.image_url}
              alt={ev.title}
              className="blog-card-img"
              fallbackGradient={gradients[i % gradients.length]}
            />
          ) : (
            <PlaceholderImg
              className="blog-card-img"
              gradient={gradients[i % gradients.length]}
              alt={ev.title}
            />
          )}
        </div>
        <div className="blog-card-content event-card-content">
          <h3 className="blog-card-title event-card-title">
            {decodeHTML(ev.title)}
          </h3>
          
          <div className="blog-card-meta-secondary event-card-meta">
            <span className="event-meta-item">
              <Icon name="event" size={16} className="event-meta-icon" />
              <strong className="event-meta-label">
                {new Date(ev.event_date).toLocaleDateString(t.locale || 'en-US', {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </strong>
            </span>
            {ev.event_time && (
              <span className="event-meta-item">
                <Icon name="schedule" size={16} />
                <span>
                  {new Date(`1970-01-01T${ev.event_time}`).toLocaleTimeString(t.locale || 'en-US', {
                    hour: 'numeric',
                    minute: '2-digit'
                  })}
                </span>
              </span>
            )}
            {ev.location && (
              <span className="event-meta-item-start">
                <Icon name="location_on" size={16} className="event-meta-icon-muted" />
                <span>{ev.location}</span>
              </span>
            )}
          </div>
          
          {ev.description && (
            <p className="event-card-description">
              {decodeHTML(ev.description).replace(/<[^>]+>/g, '')}
            </p>
          )}
          
          <span className="event-card-readmore">
            {t.viewDetails} <Icon name="chevron_right" size={16} />
          </span>
        </div>
      </article>
    </motion.div>
  );

  return (
    <div className="page-content">
      <section className="section scheme-2">
        <div className="container">
          <AnimatedSection>
            <div className="prose center events-header-wrapper">
              <Eyebrow>{t.eyebrow}</Eyebrow>
              <h1 className="h1">{t.title}</h1>
              <p className="lead events-header-lead">{t.intro}</p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="section scheme-3 events-section-main">
        <div className="container">
          {loading ? (
            <div className="events-loading">
              {t.loading}
            </div>
          ) : events.length === 0 ? (
            <AnimatedSection>
              <p className="muted2 events-empty-box">
                {t.noEvents}
              </p>
            </AnimatedSection>
          ) : (
            <>
              {/* Search Bar */}
              <EventSearch
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder={t.searchPlaceholder}
              />

              {filteredEvents.length === 0 ? (
                <AnimatedSection>
                  <p className="muted2 events-empty-box">
                    {t.noMatchingEvents}
                  </p>
                </AnimatedSection>
              ) : (
                <>
                  {/* Tab Navigation */}
                  <div className="events-tabs-container">
                    <button 
                      type="button"
                      className={`events-tab-btn ${activeTab === 'upcoming' ? 'active' : ''}`}
                      onClick={() => setActiveTab('upcoming')}
                    >
                      {t.tabUpcoming}
                      {activeTab === 'upcoming' && (
                        <motion.div layoutId="activeTabIndicator" className="events-tab-indicator" />
                      )}
                    </button>
                    <button 
                      type="button"
                      className={`events-tab-btn ${activeTab === 'past' ? 'active' : ''}`}
                      onClick={() => setActiveTab('past')}
                    >
                      {t.tabPast}
                      {activeTab === 'past' && (
                        <motion.div layoutId="activeTabIndicator" className="events-tab-indicator" />
                      )}
                    </button>
                  </div>

                  {/* Tab Content */}
                  <AnimatePresence mode="wait">
                    {activeTab === 'upcoming' ? (
                      <motion.div
                        key="upcoming"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.3 }}
                      >
                        {upcomingEvents.length > 0 ? (
                          <div className="blog-grid events-grid-wrapper">
                            {upcomingEvents.map((ev, i) => renderEventCard(ev, i))}
                          </div>
                        ) : (
                          <p className="muted2 events-empty-box">
                            {t.noUpcomingEvents}
                          </p>
                        )}
                      </motion.div>
                    ) : (
                      <motion.div
                        key="past"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.3 }}
                      >
                        {pastEvents.length > 0 ? (
                          <>
                            <div className="blog-grid events-grid-wrapper">
                              {pastEvents.slice(0, pastLimit).map((ev, i) => renderEventCard(ev, i))}
                            </div>
                            
                            {pastEvents.length > pastLimit && (
                              <div className="events-load-more-container">
                                <button 
                                  type="button" 
                                  className="btn btn-secondary" 
                                  onClick={() => setPastLimit(prev => prev + 6)}
                                >
                                  {t.loadMore}
                                </button>
                              </div>
                            )}
                          </>
                        ) : (
                          <p className="muted2 events-empty-box">
                            {t.noPastEvents}
                          </p>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}
            </>
          )}
        </div>
      </section>

      {/* Event Details Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="event-modal-overlay"
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="event-modal-card scheme-3"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                type="button" 
                className="event-modal-close-btn" 
                onClick={() => setSelectedEvent(null)} 
                aria-label="Close"
              >
                <Icon name="close" size={24} />
              </button>
              
              <div className="event-modal-img-wrapper">
                {selectedEvent.image_url ? (
                  <img 
                    src={selectedEvent.image_url} 
                    alt={selectedEvent.title} 
                    className="event-modal-img" 
                  />
                ) : (
                  <PlaceholderImg
                    className="event-modal-img"
                    gradient="linear-gradient(135deg, #2c5f3a 0%, #112617 100%)"
                    alt={selectedEvent.title}
                  />
                )}
              </div>
              
              <div className="event-modal-content">
                <h2 className="h4 event-modal-title">
                  {decodeHTML(selectedEvent.title)}
                </h2>
                
                <div className="event-modal-meta">
                  <span className="event-meta-item">
                    <Icon name="event" size={18} className="event-meta-icon" />
                    <strong>
                      {new Date(selectedEvent.event_date).toLocaleDateString(t.locale || 'en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </strong>
                  </span>
                  {selectedEvent.event_time && (
                    <span className="event-meta-item">
                      <Icon name="schedule" size={18} />
                      <span>
                        {new Date(`1970-01-01T${selectedEvent.event_time}`).toLocaleTimeString(t.locale || 'en-US', {
                          hour: 'numeric',
                          minute: '2-digit'
                        })}
                      </span>
                    </span>
                  )}
                  {selectedEvent.location && (
                    <span className="event-meta-item-start">
                      <Icon name="location_on" size={18} className="event-meta-icon-muted" />
                      <span>{selectedEvent.location}</span>
                    </span>
                  )}
                </div>
                
                {selectedEvent.description && (
                  <div 
                    className="prose event-modal-description" 
                    dangerouslySetInnerHTML={{ __html: selectedEvent.description }} 
                  />
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
