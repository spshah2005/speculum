import React, { useEffect, useState } from "react";
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import '../styles/Wardrobe.css';
import { useAuth } from "../context/AuthContext";

export default function OutfitLibrary() {
  const [outfits, setOutfits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const { currentUser } = useAuth();
  // Delete outfit by id
  const handleDeleteOutfit = async (outfitId) => {
    if (!currentUser) return;
    setDeletingId(outfitId);
    try {
      const db = firebase.firestore();
      const docRef = db.collection('users').doc(currentUser.uid);
      await docRef.collection('outfits').doc(outfitId).delete();
      setOutfits(outfits => outfits.filter(o => o.id !== outfitId));
    } catch (error) {
      console.error('Error deleting outfit:', error);
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    async function fetchOutfits() {
      if (!currentUser) {
        setOutfits([]);
        setLoading(false);
        return;
      }
      try {
        const db = firebase.firestore();
        const docRef = db.collection('users').doc(currentUser.uid);
        const outfitsCol = docRef.collection('outfits');
        const snapshot = await outfitsCol.orderBy('createdAt', 'desc').get();
        const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setOutfits(fetched);
      } catch (error) {
        console.error('Error fetching outfits:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchOutfits();
  }, [currentUser]);

  return (
    <div className="wardrobe-container" style={{padding: '32px 0'}}>
      <h2 style={{marginBottom: '24px', color: '#fff'}}>Outfit Library</h2>
      {loading ? (
        <div style={{color: '#fff'}}>Loading...</div>
      ) : outfits.length === 0 ? (
        <div style={{color: '#fff'}}>No outfits saved yet.</div>
      ) : (
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px'}}>
          {outfits.map(outfit => (
            <div key={outfit.id} style={{background: '#333', borderRadius: '8px', padding: '12px', boxShadow: '0 2px 8px #111', minHeight: '260px', maxHeight: '260px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', position: 'relative'}}>
              <div style={{fontWeight: 'bold', marginBottom: '8px', fontSize: '1.1em', color: '#fff', textAlign: 'center'}}>{outfit.name || 'Outfit'}</div>
              <div style={{display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', alignItems: 'center', flex: 1, width: '100%'}}>
                {outfit.items.map((item, idx) => (
                  <img key={idx} src={item.imgUrl} alt={item.title || `Item ${idx}`} style={{width: '80px', height: '80px', objectFit: 'contain', borderRadius: '6px', background: '#222', border: '1px solid #444'}} />
                ))}
              </div>
              <button
                onClick={() => handleDeleteOutfit(outfit.id)}
                disabled={deletingId === outfit.id}
                style={{
                  marginTop: '16px', background: '#c00', color: '#fff', border: 'none', borderRadius: '4px', padding: '6px 16px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1em', width: '80%', alignSelf: 'center'
                }}
              >
                {deletingId === outfit.id ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
