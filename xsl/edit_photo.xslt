<xsl:transform
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  version="2.0"
  >
<xsl:output method="html" indent="yes" /> 
<xsl:strip-space elements="*" />

<xsl:variable name="language_selection">
	<xsl:value-of select="document('languages.xml')"/>

</xsl:variable>	
<xsl:param name="def_lang"></xsl:param>
	


<xsl:template match="/">

	<table>
		<xsl:apply-templates/>
	</table>

</xsl:template>


<xsl:template match="/set/record">
	  <tr>
		<th><h2>Kuva</h2></th>
		<th><h2>Metadata</h2></th>
		
	</tr>
    <tr>
        <td class="info">
			
			<h3>
				<xsl:value-of select=".//title"/>
			</h3>
			<xsl:apply-templates select=".//thumbnail"/>
			<div>
				<input class="enabled" type="checkbox" checked="checked"/> Include photo
			</div>
			<div>	
				<b>description:</b><xsl:value-of select=".//description"/>
			</div>
			<div>
				<b>date:</b><xsl:value-of select=".//date"/>
			</div>

        </td>
		<td class="xml">
			
			
			
			
			<!-- titles -->
			<div class="holder">
				<div class="div_title">Otsikot</div>
				<div class="link addinput">+</div>
				<div class="frame">
			
					<xsl:apply-templates select=".//title"/>

					
				</div>
			</div>

			<!-- commons_title -->
			<div class="holder">
				<div class="div_title">Otsikko Commonssissa</div>
				<div class="frame">
					
					<xsl:choose>
						<xsl:when test=".//commons_title">
							<xsl:apply-templates select=".//commons_title"/>
						</xsl:when>
						<xsl:otherwise>
							<xsl:call-template name="empty_input" >
								<xsl:with-param name="titleName">commons_title</xsl:with-param>
							</xsl:call-template>
						</xsl:otherwise>
					</xsl:choose>
				
				</div>
			</div>

			<!-- description -->
			<div class="holder">
				<div class="div_title">Kuvailu</div>
				<div class="link addinput">+</div>
				<div class="frame">
			
					<xsl:apply-templates select=".//description" />
			
				</div>
			</div>


			
			<!-- date -->
			<div class="holder">
				<div class="div_title">Milloin kuva on otettu?</div>
				<div class="link addinput">+</div>
				<div class="frame">
					
					<xsl:choose>
						<xsl:when test=".//date">
							<xsl:apply-templates select=".//date"/>
						</xsl:when>
						<xsl:otherwise>
							<xsl:call-template name="empty_input" >
								<xsl:with-param name="titleName">date</xsl:with-param>
							</xsl:call-template>
						</xsl:otherwise>
					</xsl:choose>
				
				</div>
			</div>



			<!-- author-->
			<div class="holder">
				<div class="div_title">Kuka/ketkä kuvan on ottanut?</div>
				<div class="link addinput">+</div>
				<div class="frame">
					
					<xsl:choose>
						<xsl:when test=".//photographer">
							<xsl:apply-templates select=".//photographer"/>
						</xsl:when>
						<xsl:otherwise>
							<xsl:call-template name="empty_input" >
								<xsl:with-param name="titleName">photographer</xsl:with-param>
							</xsl:call-template>
						</xsl:otherwise>
					</xsl:choose>
			
				</div>
			</div>
			


			<!-- location -->
			<div class="holder">
				<div class="div_title">Kameran sijainti</div>
				<div class="frame">
					
					<xsl:choose>
						<xsl:when test=".//camera_location">
							<xsl:apply-templates select=".//camera_location"/>
						</xsl:when>
						<xsl:otherwise>
							<xsl:call-template name="empty_input" >
								<xsl:with-param name="titleName">camera_location</xsl:with-param>
							</xsl:call-template>
						</xsl:otherwise>
					</xsl:choose>
				
				</div>
			</div>





			<!-- depicted people -->
			<div class="holder">
				<div class="div_title">Kuvassa näkyvät henkilöt</div>
				<div class="link addinput">+</div>
				<div class="frame">
					
					<xsl:choose>
						<xsl:when test=".//depicted_people">
							<xsl:apply-templates select=".//depicted_people"/>
						</xsl:when>
						<xsl:otherwise>
							<xsl:call-template name="wikidata_entry" >
								<xsl:with-param name="titleName">depicted_people</xsl:with-param>
							</xsl:call-template>
						</xsl:otherwise>
					</xsl:choose>
				
				</div>
			</div>



			<!-- depicted place -->
			<div class="holder">
				<div class="div_title">Kuvassa näkyvät paikat</div>
				<div class="link addinput">+</div>
				<div class="frame">
					
					<xsl:choose>
						<xsl:when test=".//depicted_place">
							<xsl:apply-templates select=".//depicted_place"/>
						</xsl:when>
						<xsl:otherwise>
							<xsl:call-template name="wikidata_entry" >
								<xsl:with-param name="titleName">depicted_place</xsl:with-param>
							</xsl:call-template>
						</xsl:otherwise>
					</xsl:choose>
				
				</div>
			</div>


			<!-- publisher-->
			<div class="holder">
				<div class="div_title">Julkaisija</div>
				<div class="link addinput">+</div>
				<div class="frame">
					
					<xsl:choose>
						<xsl:when test=".//publisher">
							<xsl:apply-templates select=".//publisher"/>
						</xsl:when>
						<xsl:otherwise>
							<xsl:call-template name="empty_input" >
								<xsl:with-param name="titleName">publisher</xsl:with-param>
							</xsl:call-template>
						</xsl:otherwise>
					</xsl:choose>
			
				</div>
			</div>
			

			<!-- institution-->
			<div class="holder">
				<div class="div_title">Arkistoija</div>
				<div class="frame">
					<xsl:choose>
						<xsl:when test=".//institution">
							<xsl:apply-templates select=".//institution"/>
						</xsl:when>
						<xsl:otherwise>
							<xsl:call-template name="empty_input" >
								<xsl:with-param name="titleName">institution</xsl:with-param>
							</xsl:call-template>
						</xsl:otherwise>
					</xsl:choose>
				</div>
			</div>

			<!-- identifiers (uri) -->
			<div class="holder">
				<div class="div_title">Tunniste</div>
				<div class="frame">
					<xsl:choose>
						<xsl:when test=".//accession_number">
							<xsl:apply-templates select=".//accession_number"/>
						</xsl:when>
						<xsl:otherwise>
							<xsl:call-template name="empty_input" >
								<xsl:with-param name="titleName">accession_number</xsl:with-param>
							</xsl:call-template>
						</xsl:otherwise>
					</xsl:choose>					
				
				</div>
			</div>				


			<!-- permissions-->
			<div class="holder">
				<div class="div_title">Käyttöoikeudet</div>
				<div class="frame">
					<xsl:choose>
						<xsl:when test=".//permission">
							<xsl:apply-templates select=".//permission"/>
						</xsl:when>
						<xsl:otherwise>
							<xsl:call-template name="empty_input" >
								<xsl:with-param name="titleName">permission</xsl:with-param>
							</xsl:call-template>
						</xsl:otherwise>
					</xsl:choose>
				</div>
			</div>


			<!-- file-->
			<div class="holder">
				<div class="div_title">Tiedostot</div>
				<div class="frame">
					<xsl:apply-templates select=".//imgurl"/>
				</div>
			</div>	


			<!-- commons category -->
			<div class="holder">
				<div class="div_title">Commons kategoriat</div>
				<div class="link addinput">+</div>
				<div class="frame">
					<xsl:choose>
						<xsl:when test=".//category">
							<xsl:apply-templates select=".//category"/>
						</xsl:when>
						<xsl:otherwise>
							<xsl:call-template name="empty_input" >
								<xsl:with-param name="titleName">category</xsl:with-param>
							</xsl:call-template>
						</xsl:otherwise>
					</xsl:choose>
				</div>
			</div>
			

			<!-- source -->
			<div class="holder">
				<div class="div_title">Source URL</div>
				<div class="frame">
					
					<xsl:choose>
						<xsl:when test=".//source">
							<xsl:apply-templates select=".//source"/>
						</xsl:when>
						<xsl:otherwise>
							<xsl:call-template name="empty_input" >
								<xsl:with-param name="titleName">source</xsl:with-param>
							</xsl:call-template>
						</xsl:otherwise>
					</xsl:choose>
					
				</div>
			</div>	

			
			<!-- commons URL -->
			<div class="holder">
				<div class="div_title">COMMONS linkki (talletettu)</div>
				<div class="frame">
					
					<xsl:choose>
						<xsl:when test=".//commons_url">
							<xsl:apply-templates select=".//commons_url"/>
						</xsl:when>
						<xsl:otherwise>
							<xsl:call-template name="empty_input" >
								<xsl:with-param name="titleName">commons_url</xsl:with-param>
							</xsl:call-template>
						</xsl:otherwise>
					</xsl:choose>
					
				</div>
			</div>	
			
			<a href="#" class="button preview">preview</a> 
			<!-- <div class="button xml_export">XML</div> -->
			<!-- <button type="button" class="save2commons">Save to Commons!</button> -->
		</td>
    </tr>
    
</xsl:template>




<!-- read languages from XML and set selected language -->
<xsl:template name="lang_set">
	<xsl:param name="lang" />
	<select class="language_selection">
		<xsl:for-each select="document('languages.xml')//option">
				
			<xsl:choose>
				<xsl:when test="$lang = ./@value">
					<option value="{./@value}" selected="selected">
						<xsl:value-of select="." />
					</option>
					
				</xsl:when>
				<xsl:otherwise><xsl:copy-of select="." /></xsl:otherwise>
			</xsl:choose>
				
		</xsl:for-each>
	</select>
</xsl:template>


<xsl:template name="wikidata_entry">
	<xsl:param name="titleName" />
	

		<div class="input_holder">
			<div id="basic_input_data_auto">
				<div>
					<div class="input_title"><xsl:value-of select="$titleName" />:</div> 
					<div class="labelright">
						<div class="link openwikidata">wikidata</div>
					</div>
					<input name="{$titleName}" class="autocomplete {$titleName}" type="text" />
				</div>
			</div>
		</div>	

	
</xsl:template>




<xsl:template name="empty_input">
	<xsl:param name="titleName" />
	

		<div class="input_holder">
			<div id="basic_input_data">
				<div>
					<div class="input_title"><xsl:value-of select="$titleName" />:</div> 

					<input class="{$titleName}" name="{$titleName}" type="text" />
				</div>
			</div>
		</div>	
</xsl:template>


<!-- ******************************************  -->
<!-- translatable fields (title and description) -->
<!-- ******************************************  -->

<xsl:template match="title">
	
			<div class="input_holder">
				<div id="basic_lang_input">
					<div>
						<div class="input_title">title:</div> 
					

					<xsl:choose>
						<xsl:when test="./@lang">
							<xsl:call-template name="lang_set" >
								<xsl:with-param name="lang">
									<xsl:value-of select="./@lang" />
								</xsl:with-param>
							</xsl:call-template>
							<input class="title_{./@lang}" name="title_{./@lang}" type="text" value="{.}"/>
						</xsl:when>
						<xsl:otherwise>
							<xsl:call-template name="lang_set" >
								<xsl:with-param name="lang">
									<xsl:value-of select="$def_lang" />
								</xsl:with-param>
							</xsl:call-template>
							<input class="title_{$def_lang}" name="title_{$def_lang}" type="text" value="{.}"/>
						</xsl:otherwise>
					</xsl:choose>
					</div>
				</div>
			</div>

</xsl:template>


<xsl:template match="description">

		<div class="input_holder">
			<div id="basic_lang_input">
				<div>
					<div class="input_title">description:</div> 
					
					<xsl:choose>
						<xsl:when test="./@lang">
					
							<xsl:call-template name="lang_set" >
								<xsl:with-param name="lang">
									<xsl:value-of select="./@lang" />
								</xsl:with-param>
							</xsl:call-template>
								
							<textarea class="description_{./@lang}" name="description_{./@lang}" >
								<xsl:choose>
									<xsl:when test=". != ''">
										<xsl:value-of select="."></xsl:value-of>
									</xsl:when> 
									<xsl:otherwise>&#160;</xsl:otherwise> <!-- without space textarea collapses -->
								</xsl:choose>
							</textarea>
							
						</xsl:when>
						<xsl:otherwise>
							<xsl:call-template name="lang_set" >
								<xsl:with-param name="lang">
									<xsl:value-of select="$def_lang" />
								</xsl:with-param>
							</xsl:call-template>	
							<textarea class="description_{$def_lang}" name="description_{$def_lang}" >
								<xsl:choose>
									<xsl:when test=". != ''">
										<xsl:value-of select="."></xsl:value-of>
									</xsl:when> 
									<xsl:otherwise>&#160;</xsl:otherwise> <!-- without space textarea collapses -->
								</xsl:choose>
							</textarea>						
						</xsl:otherwise>
					</xsl:choose>
				</div>
			</div>
		</div>

</xsl:template>


<!-- ******************************************  -->
<!-- basic fields -->
<!-- ******************************************  -->

<xsl:template match="depicted_people">

			<div class="input_holder">
				<div id="basic_input">
					<div>
						<div class="input_title">depicted_people:</div> 
						<input class="autocomplete depicted_people" name="depicted_people" type="text" value="{.}"/>
					</div>
				</div>
			</div>

</xsl:template>



<xsl:template match="depicted_place">

			<div class="input_holder">
				<div id="basic_input">
					<div>
						<div class="input_title">depicted_place:</div> 
						<input class="autocomplete depicted_place" name="depicted_place" type="text" value="{.}"/>
					</div>
				</div>
			</div>

</xsl:template>

<xsl:template match="institution">

			<div class="input_holder">
				<div id="basic_input">
					<div>
						<div class="input_title">institution:</div> 
						<input class="institution" name="institution" type="text" value="{.}"/>
					</div>
				</div>
			</div>

</xsl:template>






<xsl:template match="photographer">

			<div class="input_holder">
				<div id="basic_input">
					<div>
						<div class="input_title">photographer:</div> 
						<input class="photographer" name="photographer" type="text" value="{.}"/>
					</div>
				</div>
			</div>

</xsl:template>




<xsl:template match="camera_location">

			<div class="input_holder">
				<div id="basic_input">
					<div>
						<div class="input_title">camera_location:</div> 
						<input class="camera_location" name="camera_location" type="text" value="{.}"/>
					</div>
				</div>
			</div>

</xsl:template>


<xsl:template match="commons_title">

			<div class="input_holder">
				<div id="basic_input">
					<div>
						<div class="input_title">commons_title:</div> 
						<input class="commons_title" name="commons_title" type="text" value="{.}"/>
					</div>
				</div>
			</div>

</xsl:template>

<xsl:template match="permission">

			<div class="input_holder">
				<div id="basic_input">
					<div>
						<div class="input_title">permission:</div> 
						<input class="permission" name="permission" type="text" value="{.}"/>
					</div>
				</div>
			</div>

</xsl:template>







<xsl:template match="accession_number">

			<div class="input_holder">
				<div id="basic_input">
					<div>
						<div class="input_title">accession number:</div> 
						<input class="accession_number" name="accession_number" type="text" value="{.}"/>
					</div>
				</div>
			</div>

</xsl:template>



<xsl:template match="commons_url">
	
			<div class="input_holder">
				<div id="basic_input">
					<div>
						<div class="input_title">commons_url:</div> 
						<input class="commons_url" name="commons_url" type="text" value="{.}"/>
					</div>
				</div>
			</div>

</xsl:template>




<xsl:template match="location">
	
			<div class="input_holder">
				<div id="basic_input">
					<div>
						<div class="input_title">location:</div> 
						<input class="location" name="location" type="text" value="{.}"/>
					</div>
				</div>
			</div>

</xsl:template>




<xsl:template match="wikidata_location">
	
			<div class="input_holder">
				<div id="basic_input">
					<div>
						<div class="input_title">wikidata location:</div> 
						<input name="wikidata_location" class="autocomplete wikidata_location" type="text" value="{.}" />
					</div>
				</div>
			</div>

</xsl:template>



<xsl:template match="source">
	
			<div class="input_holder">
				<div id="basic_input">
					<div>
						<div class="input_title">source:</div> 
						<input class="source"  name="source" type="text" value="{.}"/>
					</div>
				</div>
			</div>

</xsl:template>



<xsl:template match="category">
	
			<div class="input_holder">
				<div id="basic_input">
					<div>
						<div class="input_title">category:</div> 
						<input class="category"  name="category" type="text" value="{.}"/>
					</div>
				</div>
			</div>

</xsl:template>



<xsl:template match="uri">
	
			<div class="input_holder">
				<div id="basic_input">
					<div>
						<div class="input_title">uri:</div> 
						<input class="uri" name="uri" type="text" value="{.}"/>
					</div>
				</div>
			</div>

</xsl:template>




<xsl:template match="publisher">

			<div class="input_holder">
				<div id="basic_input">
					<div>
						<div class="input_title">publisher:</div> 
						<input name="publisher" class="rename_me publisher" type="text" value="{.}"/>
					</div>
				</div>
			</div>
  
</xsl:template>





<xsl:template match="date">
	
		<div class="input_holder">
			<div id="basic_input">
				<div>
					<div class="input_title">date:</div> 
					<input class="date" name="date" type="text" value="{.}" />
					date precision: <select class="other_date_select">
						<option name="no_other_date">no other date</option>
						<option name="after">after</option>
						<option name="before">before</option>
						<option name="circa">circa</option>
						<option name="decade">decade (1960's)</option>
						<option name="century">century (19th)</option>
						<option class="select-dash" disabled="disabled">----range----</option>

					</select>
				</div>
			</div>
		</div>
   
</xsl:template>


<xsl:template match="imgurl">
	
		<div class="input_holder">
			<div id="basic_input">
				<div>
					<div class="input_title">imgurl:</div> 
					<input class="imgurl" name="imgurl" type="text" value="{.}" disabled="disabled"/>
				</div>
			</div>
		</div>
   
</xsl:template>






<xsl:template match="thumbnail">
	<div>
		<img src="{.}" />
    </div>
</xsl:template>




<xsl:template match="fileurl_jpg">
    <div class="fileurl_jpg">
		<a name="fileurl_jpg" href="{.}"><xsl:value-of select="."/></a>
    </div>
</xsl:template>



<xsl:template match="text()"/>
<xsl:template match="comment()"/>



</xsl:transform>

