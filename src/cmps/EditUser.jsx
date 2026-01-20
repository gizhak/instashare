import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';



import { loadUser } from '../store/actions/user.actions';
import { userService } from '../services/user';
import { useDispatch } from 'react-redux';

export function EditUser() {

    const user = useSelector((storeState) => storeState.userModule.user);

    const [charCount, setCharCount] = useState(0)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedGender, setSelectedGender] = useState('Prefer not to say');

    console.log('user in EditUser:', user);

    // useEffect(() => {
    //     loadUser(user);
    // }, [user]);

    function handleChange(ev) {
        const value = ev.target.value;
        console.log('value:', value);
        setCharCount(value.length);
    }


    function handleChangeImage(ev) {
        const file = ev.target.files[0];
        console.log('Selected file:', file);
        // Here you can call the upload service to upload the image
        // and update the user's profile picture accordingly.

        if (!file) return;

    }

    return (

        <section className="edit-profile-container">
            <h3 className='edit-title'>Edit profile</h3>
            <div className="user-profile" >
                {user && (
                    <div className="user-info-edit">
                        <img src={user.imgUrl} alt="" />
                        <h5>{user.fullname}</h5>
                    </div>
                )}
                <label htmlFor="upload-photo" className="change-photo-btn" >
                    Change photo
                </label>
                <input type="file" id="upload-photo" hidden onChange={handleChangeImage} />
            </div>
            <form className='edit-user-form' action="">
                <label htmlFor="website">Website</label>
                <input type="text" id="website" name="website" placeholder="Website" />
                <p className='web-p'>Editing your links is only available on mobile. Visit the Instagram app and edit your profile to change the websites in your bio.</p>


                <div className='edit-bio-container'>
                    <label htmlFor="bio">Bio</label>
                    <textarea id="bio" name="bio" placeholder="Bio" onChange={handleChange} />
                    <span className="char-count">{charCount}/150</span>
                </div>

                {/* <label htmlFor="show-threads-badge">Show Threads badge</label>
                <input type="checkbox" id="show-threads-badge" name="show-threads-badge" /> */}





                <div className='gender-container'>
                    <label htmlFor="Gender">Gender</label>
                    <div className={`gender-select-container ${selectedGender === 'Custom' ? 'active' : ''}`}>
                        <button className='gender-select-btn' type="button" onClick={() => setIsModalOpen(!isModalOpen)}>
                            <div className={`selected-text`}>
                                {selectedGender}
                                {/* {selectedGender === 'Custom' && (
                                    <input type="text" placeholder="Custom gender" />
                                )} */}
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


                {/* <select id='gender-select' name='gender'>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                    <option value="male">Male</option>
                    <option value=" female">Female</option>
                    <option value="non-binary">Custom
                        <input type="text" />
                    </option>
                </select> */}

                {/* <label htmlFor="Show account suggestions on profiles">Show account suggestions on profiles</label>
                <input type="checkbox" id="Show account suggestions on profiles" name="Show account suggestions on profiles" /> */}



                <div className='submit-btn-container'>
                    <button className="submit-btn" type="submit">Submit</button>
                </div>


            </form>

        </section>

    )
}