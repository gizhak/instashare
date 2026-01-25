import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

// import for action of loading image from user from another function
import { uploadService } from '../services/upload.service';
import { store } from '../store/store';
import { LoadingSpinner } from '../cmps/LoadingSpinner';



import { loadUser } from '../store/actions/user.actions';
import { userService } from '../services/user';
import { useDispatch } from 'react-redux';
import { showSuccessMsg } from '../services/event-bus.service';

export function EditUser() {

    const user = useSelector((storeState) => storeState.userModule.user);

    const [charCount, setCharCount] = useState(0)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedGender, setSelectedGender] = useState('Prefer not to say');
    const [website, setWebsite] = useState('');
    const [bio, setBio] = useState('');
    const [customGender, setCustomGender] = useState('');

    // get fun from userdetails
    const [isUploading, setIsUploading] = useState(false);

    const navigate = useNavigate()

    console.log('user in EditUser:', user);

    useEffect(() => {
        if (user) {
            setWebsite(user.website || '');
            setBio(user.bio || '');
            setCharCount(user.bio?.length || 0);
            setSelectedGender(user.gender || 'Prefer not to say');
            setCustomGender(user.customGender || '');
        }
    }, [user]);

    function handleChange(ev) {
        const value = ev.target.value;
        console.log('value:', value);
        setBio(value);
        setCharCount(value.length);
    }


    async function handleChangeImage(ev) {
        setIsUploading(true);
        console.log('ev:', ev.target.files[0]);
        const file = ev.target.files[0];
        if (!file) return;

        try {
            setIsUploading(true);
            console.log('Uploading file...');

            const imgUrl = await uploadService.uploadImg(file);
            console.log('Uploaded file URL:', imgUrl);

            if (!imgUrl) {
                throw new Error('Failed to upload image - no URL returned');
            }

            const updatedUser = { ...user, imgUrl: imgUrl };
            await userService.update(updatedUser);
            store.dispatch({ type: 'SET_WATCHED_USER', user: updatedUser });
            store.dispatch({ type: 'SET_USER', user: updatedUser });

            console.log('User image updated successfully');
            setIsModalOpen(false);
        } catch (err) {
            console.error('Error uploading image:', err);
            alert('Failed to upload image. Please try again.');
        } finally {
            showSuccessMsg('Profile photo updated');
            setIsUploading(false);
        }

    }

    async function handleSubmit(ev) {
        ev.preventDefault();

        try {
            const updatedUser = {
                ...user,
                website,
                bio,
                gender: selectedGender,
                customGender: selectedGender === 'Custom' ? customGender : ''
            };

            await userService.update(updatedUser);
            store.dispatch({ type: 'SET_WATCHED_USER', user: updatedUser });
            store.dispatch({ type: 'SET_USER', user: updatedUser });

            showSuccessMsg('Profile updated');
            navigate(-1);
        } catch (err) {
            console.error('Error updating profile:', err);
            alert('Failed to update profile. Please try again.');
        }
    }

    return (

        <section className="edit-profile-container">
            <h3 className='edit-title'>Edit profile</h3>
            <div className="user-profile" >
                {isUploading && <LoadingSpinner message="Uploading profile photo..." />}
                {user && (
                    <div className="user-info-edit">
                        <img src={user.imgUrl} alt="" />
                        <h5>{user.fullname}</h5>
                    </div>
                )}
                <label htmlFor="upload-photo" className="change-photo-btn" >
                    Change photo
                </label>
                <input
                    type="file"
                    id="upload-photo"
                    hidden
                    onChange={handleChangeImage} />
            </div>
            <form className='edit-user-form' action="">
                <label htmlFor="website">Website</label>
                <input
                    type="text"
                    id="website"
                    name="website"
                    placeholder="Website"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                />
                <p className='web-p'>Editing your links is only available on mobile. Visit the Instagram app and edit your profile to change the websites in your bio.</p>


                <div className='edit-bio-container'>
                    <label htmlFor="bio">Bio</label>
                    <textarea
                        id="bio"
                        name="bio"
                        placeholder="Bio"
                        value={bio}
                        onChange={handleChange}
                        maxLength={150}
                    />
                    <span className="char-count">{charCount}/150</span>
                </div>

                <div className='gender-container'>
                    <label htmlFor="Gender">Gender</label>
                    <div className={`gender-select-container ${selectedGender === 'Custom' && !customGender ? 'active' : ''}`}>
                        <button className='gender-select-btn' type="button" onClick={() => setIsModalOpen(!isModalOpen)}>
                            <div className={`selected-text`}>
                                {selectedGender === 'Custom' && customGender
                                    ? customGender
                                    : selectedGender}
                            </div>
                            <svg aria-label="Down chevron" className="select-btn" fill="currentColor" height="12" role="img" viewBox="0 0 24 24" width="12"><title>Down chevron</title>
                                <path d="M21 17.502a.997.997 0 0 1-.707-.293L12 8.913l-8.293 8.296a1 1 0 1 1-1.414-1.414l9-9.004a1.03 1.03 0 0 1 1.414 0l9 9.004A1 1 0 0 1 21 17.502Z"></path></svg>
                        </button>

                        <div className='gender-modal-container'>
                            {isModalOpen && (
                                <div className="gender-modal">
                                    {/* כאן יהיו ה-radio buttons */}
                                    <div className="modal-item" >
                                        <span>Female</span>
                                        <input type="radio"
                                            name="gender"
                                            checked={selectedGender === 'Female'}
                                            onChange={() => { setIsModalOpen(false); setSelectedGender('Female'); }} />
                                    </div>

                                    <div className="modal-item">
                                        <span>Male</span>
                                        <input type="radio"
                                            name="gender"
                                            checked={selectedGender === 'Male'}
                                            onChange={() => { setIsModalOpen(false); setSelectedGender('Male'); }} />
                                    </div>

                                    <div className="modal-item">
                                        <span>Custom</span>
                                        <input type="radio"
                                            name="gender"
                                            checked={selectedGender === 'Custom'}
                                            onChange={() => { setIsModalOpen(true); setSelectedGender('Custom'); }}

                                        />

                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Custom gender"
                                        className={`custom-gender-input`}
                                        value={customGender}
                                        onChange={(e) => setCustomGender(e.target.value)}
                                        disabled={selectedGender !== 'Custom'}
                                    />

                                    <div className="modal-item">
                                        <span>Prefer not to say</span>
                                        <input type="radio"
                                            name="gender"
                                            checked={selectedGender === 'Prefer not to say'}
                                            onChange={() => { setIsModalOpen(false); setSelectedGender('Prefer not to say'); }} />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className='submit-btn-container'>
                    <button className="submit-btn" type="submit" onClick={handleSubmit}>Submit</button>
                </div>


            </form>

        </section>

    )
}