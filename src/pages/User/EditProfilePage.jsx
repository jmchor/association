import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import ImageUploader from '../../components/ImageUploader/ImageUploader';
import HeaderImageUploader from '../../components/ImageUploader/HeaderImageUploader';
import SelectCategories from '../../components/SelectCategories';
import FormControl from '@mui/material/FormControl';


const API_URL = 'http://localhost:5005';

const EditProfilePage = () => {
	const { userId } = useParams();

	const [currentUser, setCurrentUser] = useState(null);

	const [userName, setUserName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [userBio, setUserBio] = useState('');
	const [pronouns, setPronouns] = useState('');

	const [imageUrl, setImageUrl] = useState('');
	const [headerImageUrl, setHeaderImageUrl] = useState('');
	const [categoryArray, setCategoryArray] = useState([]);
	const [uploadingImage, setUploadingImage] = useState(false);
	const [uploadingHeaderImage, setUploadingHeaderImage] = useState(false);
	const [errorMessage, setErrorMessage] = useState(null);

	const navigate = useNavigate();

	const storedToken = localStorage.getItem('authToken');

	useEffect(() => {
		if (userId) {
			axios
				.get(`${API_URL}/users/${userId}`, {
					headers: { Authorization: `Bearer ${storedToken}` },
				})
				.then((res) => {
					setCurrentUser(res.data);
				})
				.catch((err) => {
					console.error(err);
				});
		}
	}, [storedToken, userId]);

	useEffect(() => {
		if (currentUser) {
			setImageUrl(currentUser.imageUrl);
			setHeaderImageUrl(currentUser.headerImageUrl);
			setUserName(currentUser.username);
            setEmail(currentUser.email);
			setUserBio(currentUser.userbio);
			setPronouns(currentUser.pronouns);
			const tags = currentUser.categories.map((category) => {
				return category.category;
			});
			setCategoryArray(tags);
		}
	}, [currentUser]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		if (name === 'username') {
			setUserName(value);
		} else if (name === 'userbio') {
			setUserBio(value);
		} else if (name === 'categoryArray') {
			setCategoryArray(value);
		} else if (name === 'email') {
			setEmail(value);
		} else if (name === 'pronouns') {
			setPronouns(value);
		} else if (name === 'imageUrl') {
			setImageUrl(value);
		} else if (name === 'headerImageUrl') {
			setHeaderImageUrl(value);
		}
	};

	const handleUpdateProfile = (e) => {
		e.preventDefault();

		const requestBody = {
			imageUrl: imageUrl,
			headerImageUrl: headerImageUrl,
			username: userName,
			email: email,
			userbio: userBio,
			pronouns: pronouns,
			categories: categoryArray,
		};

		axios
			.put(`${API_URL}/users/${userId}`, requestBody, {
				headers: { Authorization: `Bearer ${storedToken}` },
			})
			.then((response) => {
                console.log(response.data)
                navigate(`/profile`);
			})
			.catch((err) => {
				console.error(err);
				setErrorMessage(err.response.data.message);
			});
	};

	const fixedInputClass =
		'rounded-md appearance-none relative block w-full p-3 py-2 mb-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:z-10 sm:text-sm';

	if (currentUser) {
		return (
			<div id='main-content' className='px-3 pt-3 pb-20 bg-slate-300'>
				<FormControl className='flex flex-col w-50 mx-auto gap-y-2'>

<label htmlFor="email"> Email</label>

					<input
						type='email'
						name='email'
						value={email}
						onChange={handleChange}
						id='email'
						className={fixedInputClass}
						placeholder='Email address'
					/>

					{/* Username input */}

                <label htmlFor="username">Username</label>

					<input
						type='text'
						name='username'
						value={userName}
						onChange={handleChange}
						id='name'
						className={fixedInputClass}
						placeholder='Username'
					/>


					{/* User Bio */}
                    <label htmlFor="userbio">Bio</label>
					<textarea
						type='text'
						name='userbio'
						value={userBio}
						onChange={handleChange}
						id='userbio'
						className={fixedInputClass}
					/>

					{/* Pronouns */}
                    <label htmlFor="pronouns">Pronouns</label>

					<input
						type='text'
						name='pronouns'
						value={pronouns}
						onChange={handleChange}
						id='pronouns'
						className={fixedInputClass}
						placeholder='Pronouns'
					/>

					{/* Categories */}

					<SelectCategories categoryArray={categoryArray} setCategoryArray={setCategoryArray} />

					{/* Image uploader */}

					{uploadingImage === true ? (
						<p>Uploading image, please wait...</p>
					) : (
						<img
							src={imageUrl !== '' ? imageUrl : '/images/default/default-profile.png'}
							width={250}
							height={350}
							alt=''
						/>
					)}

					<ImageUploader
						setImageUrl={setImageUrl}
						setUploadingImage={setUploadingImage}
						message={'Upload a profile picture'}
					/>

					{/* Header image Upload */}

					{uploadingHeaderImage === true ? (
						<p>Uploading image, please wait...</p>
					) : (
						<img
							src={headerImageUrl !== '' ? headerImageUrl : '/images/default/default-header.png'}
							width={250}
							height={350}
							alt=''
						/>
					)}

					<HeaderImageUploader
						setHeaderImageUrl={setHeaderImageUrl}
						setUploadingHeaderImage={setUploadingHeaderImage}
						message={'Upload a header image'}
					/>

					<Button variant='contained' type='submit' onClick={handleUpdateProfile}>
						Update Profile
					</Button>
				</FormControl>

				{errorMessage && <p className='text-red-500 text-xs p-2'>{errorMessage}</p>}
			</div>
		);
	}
};

export default EditProfilePage;
